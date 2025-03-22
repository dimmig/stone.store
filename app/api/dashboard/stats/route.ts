import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Order, User, Product } from '@prisma/client';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  averageOrderValue: number;
  pendingOrders: number;
  lowStockItems: number;
  lowStockProducts: Array<{
    id: string;
    name: string;
    price: number;
    inStock: boolean;
  }>;
  orderTrend: number;
  revenueTrend: number;
  customerTrend: number;
  aovTrend: number;
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

    // Get total orders and revenue
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum: number, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get pending orders
    const pendingOrders = orders.filter(order => order.status === 'processing').length;

    // Get total customers
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'USER',
      },
    });

    // Get out of stock items
    const lowStockProducts = await prisma.product.findMany({
      where: {
        inStock: false,
      },
      select: {
        id: true,
        name: true,
        price: true,
        inStock: true,
      },
    });

    // Calculate trends (comparing with previous period)
    const previousPeriod = new Date();
    previousPeriod.setDate(previousPeriod.getDate() - 30);

    const previousOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          lt: previousPeriod,
        },
      },
    });

    const previousRevenue = previousOrders.reduce((sum: number, order) => sum + order.total, 0);
    const previousCustomers = await prisma.user.count({
      where: {
        role: 'USER',
        createdAt: {
          lt: previousPeriod,
        },
      },
    });

    const orderTrend = previousOrders.length > 0
      ? ((totalOrders - previousOrders.length) / previousOrders.length) * 100
      : 0;

    const revenueTrend = previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    const customerTrend = previousCustomers > 0
      ? ((totalCustomers - previousCustomers) / previousCustomers) * 100
      : 0;

    const aovTrend = previousOrders.length > 0
      ? ((averageOrderValue - (previousRevenue / previousOrders.length)) / (previousRevenue / previousOrders.length)) * 100
      : 0;

    const stats: DashboardStats = {
      totalOrders,
      totalRevenue,
      totalCustomers,
      averageOrderValue,
      pendingOrders,
      lowStockItems: lowStockProducts.length,
      lowStockProducts,
      orderTrend,
      revenueTrend,
      customerTrend,
      aovTrend,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 