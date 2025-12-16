import Stripe from 'stripe';

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    })
  : null;

export const STRIPE_PRICES = {
  monthly: process.env.STRIPE_PRICE_ID_MONTHLY || '',
  yearly: process.env.STRIPE_PRICE_ID_YEARLY || '',
};

export interface CreateCheckoutSessionParams {
  companyId: string;
  companyEmail: string;
  stripeCustomerId?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: params.stripeCustomerId || undefined,
    customer_email: params.stripeCustomerId ? undefined : params.companyEmail,
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      company_id: params.companyId,
    },
    subscription_data: {
      metadata: {
        company_id: params.companyId,
      },
    },
    allow_promotion_codes: true,
  });

  return session;
}

export async function createCustomerPortalSession(
  stripeCustomerId: string,
  returnUrl: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });

  return session;
}

export async function getSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  return stripe.subscriptions.retrieve(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  return stripe.subscriptions.cancel(subscriptionId);
}
