import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

interface ShippingAddressInput {
  street: string;
  city: string;
  state: string;
  zip: string;
  name: string;
}

interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface CreateOrderInput {
  items: OrderItemInput[];
  shippingAddress: ShippingAddressInput;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    const isAdmin = user?.role === Role.ADMIN;

    // For admin users, fetch all orders. For regular users, fetch only their orders
    const orders = await prisma.order.findMany({
      where: isAdmin ? undefined : {
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
          include: {
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
        shippingAddress: {
          select: {
            street: true,
            city: true,
            state: true,
            zip: true
          }
        }
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

    const body = await req.json() as CreateOrderInput;
    const { items, shippingAddress } = body;

    if (!items || !shippingAddress) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Calculate total from items
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create shipping address
    const newShippingAddress = await prisma.address.create({
      data: {
        ...shippingAddress,
        userId: session.user.id,
        isDefault: false
      }
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        shippingAddressId: newShippingAddress.id,
        items: {
          create: items.map((item) => ({
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
          include: {
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
        shippingAddress: {
          select: {
            street: true,
            city: true,
            state: true,
            zip: true
          }
        }
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('[ORDERS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 