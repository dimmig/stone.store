import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

// Get cart items
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrls: true,
            stockQuantity: true,
          },
        },
      },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('[CART_GET]', error);
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
    const { productId, quantity = 1, size, color } = body;

    if (!productId) {
      return new NextResponse('Product ID is required', { status: 400 });
    }

    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
        price: true,
        imageUrls: true,
        stockQuantity: true,
      },
    });

    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }

    if (product.stockQuantity < quantity) {
      return new NextResponse('Not enough stock available', { status: 400 });
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId,
        size,
        color,
      },
    });

    if (existingCartItem) {
      const updatedCartItem = await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrls: true,
              stockQuantity: true,
            },
          },
        },
      });

      return NextResponse.json(updatedCartItem);
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        productId,
        quantity,
        size,
        color,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrls: true,
            stockQuantity: true,
          },
        },
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('[CART_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 