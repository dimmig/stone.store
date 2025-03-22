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
    stockQuantity: number;
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
        stockQuantity: {
          lte: 5, // Consider items with 5 or fewer units as low stock
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        stockQuantity: true,
      },
    });

    // Calculate trends (comparing with previous period)
    const now = new Date();
    const currentPeriodStart = new Date();
    currentPeriodStart.setDate(now.getDate() - 30); // Last 30 days
    
    const previousPeriodStart = new Date(currentPeriodStart);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 30); // 30 days before that

    const [currentPeriodOrders, previousPeriodOrders, currentPeriodCustomers, previousPeriodCustomers] = await Promise.all([
      // Current period orders
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: currentPeriodStart,
            lte: now,
          },
        },
      }),
      // Previous period orders
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: previousPeriodStart,
            lt: currentPeriodStart,
          },
        },
      }),
      // Current period customers
      prisma.user.count({
        where: {
          role: 'USER',
          createdAt: {
            gte: currentPeriodStart,
            lte: now,
          },
        },
      }),
      // Previous period customers
      prisma.user.count({
        where: {
          role: 'USER',
          createdAt: {
            gte: previousPeriodStart,
            lt: currentPeriodStart,
          },
        },
      }),
    ]);

    const currentPeriodRevenue = currentPeriodOrders.reduce((sum, order) => sum + order.total, 0);
    const previousPeriodRevenue = previousPeriodOrders.reduce((sum, order) => sum + order.total, 0);
    const currentPeriodAOV = currentPeriodOrders.length > 0 ? currentPeriodRevenue / currentPeriodOrders.length : 0;
    const previousPeriodAOV = previousPeriodOrders.length > 0 ? previousPeriodRevenue / previousPeriodOrders.length : 0;

    const orderTrend = previousPeriodOrders.length > 0
      ? ((currentPeriodOrders.length - previousPeriodOrders.length) / previousPeriodOrders.length) * 100
      : currentPeriodOrders.length > 0 ? 100 : 0;

    const revenueTrend = previousPeriodRevenue > 0
      ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
      : currentPeriodRevenue > 0 ? 100 : 0;

    const customerTrend = previousPeriodCustomers > 0
      ? ((currentPeriodCustomers - previousPeriodCustomers) / previousPeriodCustomers) * 100
      : currentPeriodCustomers > 0 ? 100 : 0;

    const aovTrend = previousPeriodAOV > 0
      ? ((currentPeriodAOV - previousPeriodAOV) / previousPeriodAOV) * 100
      : currentPeriodAOV > 0 ? 100 : 0;

    const stats: DashboardStats = {
      totalOrders,
      totalRevenue,
      totalCustomers,
      averageOrderValue,
      pendingOrders,
      lowStockItems: lowStockProducts.length,
      lowStockProducts,
      orderTrend: Math.round(orderTrend),
      revenueTrend: Math.round(revenueTrend),
      customerTrend: Math.round(customerTrend),
      aovTrend: Math.round(aovTrend),
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