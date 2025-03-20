import { Stripe } from 'stripe';

// Server-side Stripe instance
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia', // Updated to match the required version
      typescript: true,
    })
  : null;

// Client-side Stripe instance
export const getStripe = async () => {
  const { loadStripe } = await import('@stripe/stripe-js');
  
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error('Stripe publishable key is missing. Please add it to your .env.local file');
  }

  const stripePromise = loadStripe(publishableKey);
  return stripePromise;
};