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
  conversionRate: number;
  conversionRateTrend: number;
  customerRetentionRate: number;
  customerRetentionTrend: number;
  topProducts: Array<{
    id: string;
    name: string;
    totalSales: number;
    quantitySold: number;
  }>;
  recentCustomers: number;
  recentCustomersTrend: number;
  averageOrderProcessingTime: number;
  orderProcessingTimeTrend: number;
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
          lte: 5,
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
    currentPeriodStart.setDate(now.getDate() - 30);
    
    const previousPeriodStart = new Date(currentPeriodStart);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);

    const [
      currentPeriodOrders,
      previousPeriodOrders,
      currentPeriodCustomers,
      previousPeriodCustomers,
      currentPeriodVisitors,
      previousPeriodVisitors,
      topProducts,
      recentCustomers,
      orderProcessingTimes
    ] = await Promise.all([
      // Current period orders
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: currentPeriodStart,
            lte: now,
          },
        },
        include: {
          items: true,
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
        include: {
          items: true,
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
      Promise.resolve(1000),
      Promise.resolve(800),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true,
          price: true,
        },
        orderBy: {
          _sum: {
            price: 'desc',
          },
        },
        take: 5,
      }),
      // Recent customers (last 7 days)
      prisma.user.count({
        where: {
          role: 'USER',
          createdAt: {
            gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            lte: now,
          },
        },
      }),
      // Order processing times
      prisma.order.findMany({
        where: {
          status: 'delivered',
          createdAt: {
            gte: currentPeriodStart,
            lte: now,
          },
        },
        select: {
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    // Calculate basic trends
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

    // Calculate conversion rates
    const currentConversionRate = (currentPeriodOrders.length / currentPeriodVisitors) * 100;
    const previousConversionRate = (previousPeriodOrders.length / previousPeriodVisitors) * 100;
    const conversionRateTrend = previousConversionRate > 0
      ? ((currentConversionRate - previousConversionRate) / previousConversionRate) * 100
      : currentConversionRate > 0 ? 100 : 0;

    // Calculate customer retention
    const currentPeriodReturningCustomers = await prisma.order.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: currentPeriodStart,
          lte: now,
        },
      },
      having: {
        userId: {
          _count: {
            gt: 1,
          },
        },
      },
    });

    const previousPeriodReturningCustomers = await prisma.order.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: currentPeriodStart,
        },
      },
      having: {
        userId: {
          _count: {
            gt: 1,
          },
        },
      },
    });

    const currentRetentionRate = (currentPeriodReturningCustomers.length / currentPeriodCustomers) * 100;
    const previousRetentionRate = (previousPeriodReturningCustomers.length / previousPeriodCustomers) * 100;
    const retentionRateTrend = previousRetentionRate > 0
      ? ((currentRetentionRate - previousRetentionRate) / previousRetentionRate) * 100
      : currentRetentionRate > 0 ? 100 : 0;

    // Calculate average order processing time
    const processingTimes = orderProcessingTimes.map(order => 
      new Date(order.updatedAt).getTime() - new Date(order.createdAt).getTime()
    );
    const averageProcessingTime = processingTimes.length > 0
      ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length
      : 0;

    // Previous period processing time
    const previousProcessingTimes = await prisma.order.findMany({
      where: {
        status: 'delivered',
        createdAt: {
          gte: previousPeriodStart,
          lt: currentPeriodStart,
        },
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });

    const previousProcessingTimeValues = previousProcessingTimes.map(order =>
      new Date(order.updatedAt).getTime() - new Date(order.createdAt).getTime()
    );
    const previousAverageProcessingTime = previousProcessingTimeValues.length > 0
      ? previousProcessingTimeValues.reduce((a, b) => a + b, 0) / previousProcessingTimeValues.length
      : 0;

    const processingTimeTrend = previousAverageProcessingTime > 0
      ? ((previousAverageProcessingTime - averageProcessingTime) / previousAverageProcessingTime) * 100
      : averageProcessingTime > 0 ? -100 : 0;

    // Get product details for top products
    const topProductDetails = await Promise.all(
      topProducts.map(async (product) => {
        const productDetails = await prisma.product.findUnique({
          where: { id: product.productId },
          select: { name: true },
        });
        return {
          id: product.productId,
          name: productDetails?.name || 'Unknown Product',
          totalSales: product._sum.price || 0,
          quantitySold: product._sum.quantity || 0,
        };
      })
    );

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
      conversionRate: Math.round(currentConversionRate * 100) / 100,
      conversionRateTrend: Math.round(conversionRateTrend),
      customerRetentionRate: Math.round(currentRetentionRate * 100) / 100,
      customerRetentionTrend: Math.round(retentionRateTrend),
      topProducts: topProductDetails,
      recentCustomers,
      recentCustomersTrend: Math.round(((recentCustomers - previousPeriodCustomers) / previousPeriodCustomers) * 100),
      averageOrderProcessingTime: Math.round(averageProcessingTime / (1000 * 60 * 60 * 24)), // Convert to days
      orderProcessingTimeTrend: Math.round(processingTimeTrend),
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