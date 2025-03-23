import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            price: true,
            size: true,
            color: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrls: true,
                description: true
              }
            }
          }
        },
        shippingAddress: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('[ORDERS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { items, shippingAddress } = body;

    if (!items || !shippingAddress) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Create shipping address
    const newShippingAddress = await prisma.shippingAddress.create({
      data: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.zip,
      },
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        shippingAddressId: newShippingAddress.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          })),
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            price: true,
            size: true,
            color: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrls: true,
                description: true
              }
            }
          }
        },
        shippingAddress: true
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('[ORDERS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 