import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { Order, OrderItem, Product, CartItem } from "@prisma/client";
import { sendEmail } from '@/lib/email';
import { getOrderStatusEmailTemplate } from '@/lib/email-templates';

interface CartItemWithProduct extends CartItem {
  product: Product;
}

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

  // Use a transaction to ensure atomicity
  const order = await prisma.$transaction(async (tx) => {
    // First, verify stock availability for all items
    for (const item of cartItems) {
      const product = await tx.product.findUnique({
        where: { id: item.product.id }
      });

      if (!product || product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.product.name}`);
      }
    }

    // Create order with items
    const order = await tx.order.create({
      data: {
        userId,
        total,
        shippingAddressId: shippingAddress.id,
        trackingNumber: null,
        items: {
          create: cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size || undefined,
            color: item.color || undefined
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Update stock quantities
    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.product.id },
        data: {
          stockQuantity: {
            decrement: item.quantity
          }
        }
      });
    }

    return order;
  });

  console.log('Created order:', order.id);

  // Create notification
  await prisma.notification.create({
    data: {
      userId,
      type: 'ORDER_CREATED',
      message: `Your order #${order.id} has been created.`
    }
  });

  // Send email notification
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true }
  });

  if (user?.email) {
    await sendEmail({
      to: user.email,
      subject: `Order #${order.id} Confirmation`,
      html: getOrderStatusEmailTemplate({
        orderId: order.id,
        status: 'processing',
        appUrl: process.env.NEXT_PUBLIC_APP_URL!,
        items: order.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: order.total,
        shippingAddress: {
          name: 'Default Address',
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zip: '12345'
        }
      })
    });
  }

  console.log('Created notification and sent email');

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

  // Get cart items with product stock information
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { 
      product: true
    }
  }) as CartItemWithProduct[];

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

  // Use a transaction to ensure atomicity
  const order = await prisma.$transaction(async (tx) => {
    // First, verify stock availability for all items
    for (const item of cartItems) {
      const product = await tx.product.findUnique({
        where: { id: item.product.id }
      });

      if (!product || product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.product.name}`);
      }
    }

    // Create order with items
    const order = await tx.order.create({
      data: {
        userId,
        total,
        shippingAddressId: shippingAddress.id,
        trackingNumber: null,
        items: {
          create: cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size || undefined,
            color: item.color || undefined
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Update stock quantities
    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.product.id },
        data: {
          stockQuantity: {
            decrement: item.quantity
          }
        }
      });
    }

    return order;
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId,
      type: 'ORDER_CREATED',
      message: `Your order #${order.id} has been created.`
    }
  });

  // Send email notification
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true }
  });

  if (user?.email) {
    await sendEmail({
      to: user.email,
      subject: `Order #${order.id} Confirmation`,
      html: getOrderStatusEmailTemplate({
        orderId: order.id,
        status: 'processing',
        appUrl: process.env.NEXT_PUBLIC_APP_URL!,
        items: order.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: order.total,
        shippingAddress: {
          name: session.shipping_details.name,
          street: session.shipping_details.address.line1,
          city: session.shipping_details.address.city,
          state: session.shipping_details.address.state,
          zip: session.shipping_details.address.postal_code
        }
      })
    });
  }

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