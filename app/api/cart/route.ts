import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Use a transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // Check if product exists and has enough stock
      const product = await tx.product.findUnique({
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
        throw new Error('Product not found');
      }

      // Check if item already exists in cart
      const existingCartItem = await tx.cartItem.findFirst({
        where: {
          userId: session.user.id,
          productId,
          size,
          color,
        },
        include: {
          product: {
            select: {
              stockQuantity: true,
            },
          },
        },
      });

      const totalQuantity = existingCartItem 
        ? existingCartItem.quantity + quantity 
        : quantity;

      if (product.stockQuantity < totalQuantity) {
        throw new Error(`Only ${product.stockQuantity} items available in stock`);
      }

      if (existingCartItem) {
        return await tx.cartItem.update({
          where: {
            id: existingCartItem.id,
          },
          data: {
            quantity: totalQuantity,
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
      }

      return await tx.cartItem.create({
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
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[CART_POST]', error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse('Internal error', { status: 500 });
  }
} 