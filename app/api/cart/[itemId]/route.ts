import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Update cart item
export async function PATCH(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { itemId } = params;
    const body = await req.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return new NextResponse('Invalid quantity', { status: 400 });
    }

    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId: session.user.id,
      },
    });

    if (!cartItem) {
      return new NextResponse('Cart item not found', { status: 404 });
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity,
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
  } catch (error) {
    console.error('[CART_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// Delete cart item
export async function DELETE(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { itemId } = params;

    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId: session.user.id,
      },
    });

    if (!cartItem) {
      return new NextResponse('Cart item not found', { status: 404 });
    }

    await prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[CART_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 