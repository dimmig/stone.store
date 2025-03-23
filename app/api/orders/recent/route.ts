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

    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
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

    return NextResponse.json(recentOrders);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 