import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return new NextResponse('Session ID is required', { status: 400 });
    }

    // First check if this session exists
    const checkoutSession = await prisma.checkoutSession.findUnique({
      where: {
        sessionId: sessionId
      }
    });

    if (!checkoutSession) {
      return NextResponse.json({ exists: false, order: null });
    }

    // If session exists, find the most recent order for this user
    const recentOrder = await prisma.order.findFirst({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageUrls: true,
                price: true,
                description: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ exists: !!recentOrder, order: recentOrder });
  } catch (error) {
    console.error('Error checking session:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 