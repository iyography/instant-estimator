import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createServiceClient } from '@/lib/supabase/server';
import {
  sendSubscriptionConfirmedEmail,
  sendPaymentFailedEmail,
  sendSubscriptionCanceledEmail,
} from '@/lib/email/resend';

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
  });
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  const supabase = await createServiceClient();

  // Idempotency: check if we've already processed this event
  const { data: existing } = await supabase
    .from('webhook_events')
    .select('id')
    .eq('stripe_event_id', event.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
  }

  // Record event as processed
  await supabase.from('webhook_events').insert({
    stripe_event_id: event.id,
    event_type: event.type,
  });

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const companyId = session.metadata?.company_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (companyId) {
          const { error, data: updatedCompany } = await supabase
            .from('companies')
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscription_status: 'active',
            })
            .eq('id', companyId)
            .select('name, email')
            .single();

          if (error) {
            console.error('Error updating company after checkout:', error);
          }

          // Send subscription confirmed email
          if (updatedCompany?.email) {
            sendSubscriptionConfirmedEmail({
              companyName: updatedCompany.name,
              email: updatedCompany.email,
              planName: 'Pro',
            }).catch(err => console.error('Failed to send subscription email:', err));
          }
        } else {
          console.error('Webhook checkout.session.completed missing company_id in metadata');
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Map Stripe status to our status
        let subscriptionStatus: 'active' | 'past_due' | 'canceled' | 'inactive' = 'inactive';
        switch (subscription.status) {
          case 'active':
          case 'trialing':
            subscriptionStatus = 'active';
            break;
          case 'past_due':
            subscriptionStatus = 'past_due';
            break;
          case 'canceled':
          case 'unpaid':
            subscriptionStatus = 'canceled';
            break;
          default:
            subscriptionStatus = 'inactive';
        }

        const { error } = await supabase
          .from('companies')
          .update({ subscription_status: subscriptionStatus })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error updating subscription status:', error);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { error, data: canceledCompany } = await supabase
          .from('companies')
          .update({ subscription_status: 'canceled' })
          .eq('stripe_customer_id', customerId)
          .select('name, email')
          .single();

        if (error) {
          console.error('Error updating canceled subscription:', error);
        }

        if (canceledCompany?.email) {
          sendSubscriptionCanceledEmail({
            companyName: canceledCompany.name,
            email: canceledCompany.email,
          }).catch(err => console.error('Failed to send cancellation email:', err));
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const { error, data: failedCompany } = await supabase
          .from('companies')
          .update({ subscription_status: 'past_due' })
          .eq('stripe_customer_id', customerId)
          .select('name, email')
          .single();

        if (error) {
          console.error('Error updating payment failed status:', error);
        }

        if (failedCompany?.email) {
          sendPaymentFailedEmail({
            companyName: failedCompany.name,
            email: failedCompany.email,
          }).catch(err => console.error('Failed to send payment failed email:', err));
        }
        break;
      }

      default:
        // Unhandled event type
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error('Error processing webhook:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
