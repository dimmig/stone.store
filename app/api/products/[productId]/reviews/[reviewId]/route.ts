import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

interface RouteParams {
  params: {
    productId: string;
    reviewId: string;
  };
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if review exists and belongs to user
    const review = await prisma.review.findFirst({
      where: {
        id: params.reviewId,
        userId: session.user.id,
      },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found or unauthorized' }, { status: 404 });
    }

    // Delete review
    await prisma.review.delete({
      where: {
        id: params.reviewId,
      },
    });

    // Update product rating
    const productReviews = await prisma.review.findMany({
      where: {
        productId: params.productId,
      },
    });

    const averageRating = productReviews.length > 0
      ? productReviews.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0) / productReviews.length
      : 0;

    await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        rating: averageRating,
      } as Prisma.ProductUpdateInput,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
} 