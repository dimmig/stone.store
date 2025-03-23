import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { User } from '@prisma/client';

interface CustomerWithCount extends Omit<User, 'password'> {
  _count: {
    orders: number;
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const recentCustomers = await prisma.user.findMany({
      where: {
        role: 'USER',
      },
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    // Transform the data to include totalOrders
    const transformedCustomers = recentCustomers.map((customer: CustomerWithCount) => ({
      ...customer,
      totalOrders: customer._count.orders,
    }));

    return NextResponse.json(transformedCustomers);
  } catch (error) {
    console.error('Error fetching recent customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent customers' },
      { status: 500 }
    );
  }
} 