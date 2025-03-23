import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { User, Order } from '@prisma/client';

interface UserWithOrders extends Omit<User, 'password'> {
  orders: Order[];
  _count: {
    orders: number;
  };
}

interface TransformedUser extends Omit<UserWithOrders, 'orders' | '_count'> {
  totalOrders: number;
  totalSpent: number;
  recentOrders: Order[];
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

    const users = await prisma.user.findMany({
      where: {
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            total: true,
            createdAt: true,
            status: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    // Transform the data to include total spent and recent orders
    const transformedUsers = users.map((user: UserWithOrders): TransformedUser => ({
      ...user,
      totalOrders: user._count.orders,
      totalSpent: user.orders.reduce((sum: number, order: Order) => sum + order.total, 0),
      recentOrders: user.orders,
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 