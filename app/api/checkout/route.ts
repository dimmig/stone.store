import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { CartItem } from '@/types';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  console.log('Checkout request received');
  
  if (!stripe) {
    console.error('Stripe is not configured');
    return NextResponse.json(
      { error: 'Stripe is not properly configured. Please check your environment variables.' },
      { status: 500 }
    );
  }

  try {
    const { cartItems, userId } = await req.json();
    console.log('Processing checkout for user:', userId);
    console.log('Cart items:', cartItems.length);

    if (!cartItems?.length) {
      return NextResponse.json(
        { error: 'Please add items to your cart first.' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB'], // Add more countries as needed
      },
      line_items: cartItems.map((item: CartItem) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            images: [item.product.images[0]],
            description: `Size: ${item.size} | Color: ${item.color}`,
          },
          unit_amount: item.product.price * 100, // Stripe expects amounts in cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    });

    console.log('Stripe session created:', session.id);

    // Store the checkout session in our database
    const checkoutSession = await prisma.checkoutSession.create({
      data: {
        sessionId: session.id,
        userId,
      },
    });

    console.log('Checkout session stored in database:', checkoutSession.id);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error in checkout:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 