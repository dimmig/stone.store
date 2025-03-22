import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { Order } from "@/types";

const handleDevCheckout = async (session: any) => {
  console.log('Processing development checkout session:', session.id);

  const checkoutSession = await prisma.checkoutSession.findUnique({
    where: { sessionId: session.id }
  });

  if (!checkoutSession?.userId) {
    throw new Error('No user ID found for this checkout session');
  }

  const userId = checkoutSession.userId;
  console.log('Found user ID:', userId);

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true }
  });

  console.log('Found cart items:', cartItems.length);

  const total = cartItems.reduce((acc, item) => {
    return acc + (item.product.price * item.quantity);
  }, 0);


  const shippingAddress = await prisma.address.create({
    data: {
      userId,
      name: 'Default Address',
      street: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zip: '12345',
    }
  });

  console.log('Created shipping address');

  // Create order
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      shippingAddressId: shippingAddress.id,
      trackingNumber: null,
      items: {
        create: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }))
      }
    }
  }) as Order;

  console.log('Created order:', order.id);

  // Create notification
  await prisma.notification.create({
    data: {
      userId,
      type: 'ORDER_CREATED',
      message: `Your order #${order.id} has been created.`
    }
  });

  console.log('Created notification');

  // Clear cart
  await prisma.cartItem.deleteMany({
    where: { userId }
  });

  console.log('Cleared cart');

  // Delete the checkout session record
  await prisma.checkoutSession.delete({
    where: { sessionId: session.id }
  });

  console.log('Deleted checkout session record');

  return order;
};

const handleCheckoutComplete = async (session: any) => {
  // Get the user ID from our stored checkout session
  const checkoutSession = await prisma.checkoutSession.findUnique({
    where: { sessionId: session.id }
  });

  if (!checkoutSession?.userId) {
    throw new Error('No user ID found for this checkout session');
  }

  const userId = checkoutSession.userId;

  // Get cart items
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true }
  });

  // Calculate total
  const total = cartItems.reduce((acc, item) => {
    return acc + (item.product.price * item.quantity);
  }, 0);

  // Create shipping address from Stripe session
  const shippingAddress = await prisma.address.create({
    data: {
      userId,
      name: session.shipping_details.name,
      street: session.shipping_details.address.line1,
      city: session.shipping_details.address.city,
      state: session.shipping_details.address.state,
      zip: session.shipping_details.address.postal_code,
    }
  });

  // Create order
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      shippingAddressId: shippingAddress.id,
      trackingNumber: null,
      items: {
        create: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }))
      }
    }
  }) as Order;

  // Create notification
  await prisma.notification.create({
    data: {
      userId,
      type: 'ORDER_CREATED',
      message: `Your order #${order.id} has been created.`
    }
  });

  // Clear cart
  await prisma.cartItem.deleteMany({
    where: { userId }
  });

  // Delete the checkout session record
  await prisma.checkoutSession.delete({
    where: { sessionId: session.id }
  });

  return order;
};

export async function POST(req: Request) {
  console.log('Webhook received');
  
  if (!stripe) {
    console.error('Stripe is not configured');
    return new Response('Stripe is not configured', { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  if (!signature) {
    console.error('No signature found in webhook request');
    return new Response('No signature found', { status: 400 });
  }

  // Get the webhook secret based on environment
  const webhookSecret = process.env.NODE_ENV === 'development'
    ? process.env.STRIPE_WEBHOOK_SECRET_LOCAL
    : process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Webhook secret is missing for environment:', process.env.NODE_ENV);
    return new Response('Webhook secret is not configured', { status: 500 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
    console.log('Webhook event constructed successfully:', event.type);
  } catch (error: any) {
    console.error('Error verifying webhook signature:', error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    console.log('Processing checkout.session.completed event');
    const session = event.data.object;
    console.log('Session ID:', session.id);
    console.log('Environment:', process.env.NODE_ENV);

    try {
      const order = process.env.NODE_ENV === 'development'
        ? await handleDevCheckout(session)
        : await handleCheckoutComplete(session);

      console.log('Order created successfully:', order.id);
      return NextResponse.json({ order });
    } catch (error) {
      console.error('Error processing checkout:', error);
      return new Response('Error processing checkout', { status: 500 });
    }
  }

  return new Response(null, { status: 200 });
} 