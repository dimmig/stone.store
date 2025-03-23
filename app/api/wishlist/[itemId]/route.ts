import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Delete wishlist item
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

    // Verify wishlist item belongs to user
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        id: itemId,
        userId: session.user.id,
      },
    });

    if (!wishlistItem) {
      return new NextResponse('Wishlist item not found', { status: 404 });
    }

    await prisma.wishlistItem.delete({
      where: {
        id: itemId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[WISHLIST_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 