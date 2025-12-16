import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/server';
import { createServiceClient } from '@/lib/supabase/server';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  const supabase = await createServiceClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const companyId = session.metadata?.company_id;
        const customerId = session.customer as string;

        if (companyId && customerId) {
          // Update company with Stripe customer ID and activate subscription
          await supabase
            .from('companies')
            .update({
              stripe_customer_id: customerId,
              subscription_status: 'active',
            })
            .eq('id', companyId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        // Map Stripe status to our status
        let subscriptionStatus: 'active' | 'past_due' | 'canceled' | 'inactive' = 'active';
        if (status === 'past_due') {
          subscriptionStatus = 'past_due';
        } else if (status === 'canceled' || status === 'unpaid') {
          subscriptionStatus = 'canceled';
        } else if (status === 'incomplete' || status === 'incomplete_expired') {
          subscriptionStatus = 'inactive';
        }

        await supabase
          .from('companies')
          .update({ subscription_status: subscriptionStatus })
          .eq('stripe_customer_id', customerId);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabase
          .from('companies')
          .update({ subscription_status: 'canceled' })
          .eq('stripe_customer_id', customerId);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await supabase
          .from('companies')
          .update({ subscription_status: 'past_due' })
          .eq('stripe_customer_id', customerId);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Re-activate subscription after successful payment
        await supabase
          .from('companies')
          .update({ subscription_status: 'active' })
          .eq('stripe_customer_id', customerId);
        break;
      }

      default:
        // Unhandled event type
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
