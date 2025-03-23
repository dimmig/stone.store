import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    productId: string;
  };
}

// GET /api/products/[productId]/reviews
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId: params.productId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST /api/products/[productId]/reviews
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: params.productId,
        userId: session.user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
    }

    // Create new review
    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        productId: params.productId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Update product rating
    const productReviews = await prisma.review.findMany({
      where: {
        productId: params.productId,
      },
    });

    const averageRating = productReviews.reduce((acc, review) => acc + review.rating, 0) / productReviews.length;

    await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        rating: averageRating,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

// DELETE /api/products/[productId]/reviews/[reviewId]
export async function DELETE(
  request: Request,
  { params }: RouteParams & { params: { reviewId: string } }
) {
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
      ? productReviews.reduce((acc, review) => acc + review.rating, 0) / productReviews.length
      : 0;

    await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        rating: averageRating,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
} 