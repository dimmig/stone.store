import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Order, User, Prisma } from '@prisma/client';

interface PaymentMethodStat {
  method: string;
  _sum: {
    amount: number | null;
  };
}

interface TopCustomer extends User {
  orders: Order[];
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'week';

    const now = new Date();
    let startDate = new Date();
    let previousStartDate = new Date();

    switch (timeRange) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        previousStartDate.setDate(previousStartDate.getDate() - 1);
        previousStartDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        previousStartDate.setDate(previousStartDate.getDate() - 14);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        previousStartDate.setMonth(previousStartDate.getMonth() - 2);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 2);
        break;
    }

    // Get current period data
    const [
      currentPeriodOrders,
      previousPeriodOrders,
      paymentMethodStats,
      topCustomers,
      dailyRevenue,
      previousDayRevenue
    ] = await Promise.all([
      // Current period orders
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: now,
          },
        },
      }),
      // Previous period orders
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: previousStartDate,
            lt: startDate,
          },
        },
      }),
      // Revenue by payment method
      prisma.order.groupBy({
        by: ['status'],
        where: {
          createdAt: {
            gte: startDate,
            lte: now,
          },
        },
        _sum: {
          total: true,
        },
      }),
      // Top customers
      prisma.user.findMany({
        where: {
          role: 'USER',
          orders: {
            some: {
              createdAt: {
                gte: startDate,
                lte: now,
              },
            },
          },
        },
        include: {
          orders: {
            where: {
              createdAt: {
                gte: startDate,
                lte: now,
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        take: 5,
      }),
      // Today's revenue
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: new Date(now.setHours(0, 0, 0, 0)),
            lte: now,
          },
        },
        _sum: {
          total: true,
        },
      }),
      // Previous day's revenue
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: new Date(now.setDate(now.getDate() - 1)),
            lt: new Date(now.setHours(0, 0, 0, 0)),
          },
        },
        _sum: {
          total: true,
        },
      }),
    ]);

    // Calculate metrics
    const totalRevenue = currentPeriodOrders.reduce((sum: number, order: Order) => sum + order.total, 0);
    const previousRevenue = previousPeriodOrders.reduce((sum: number, order: Order) => sum + order.total, 0);
    const revenueTrend = previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
      : totalRevenue > 0 ? 100 : 0;

    const averageOrderValue = currentPeriodOrders.length > 0
      ? totalRevenue / currentPeriodOrders.length
      : 0;
    const previousAOV = previousPeriodOrders.length > 0
      ? previousRevenue / previousPeriodOrders.length
      : 0;
    const aovTrend = previousAOV > 0
      ? ((averageOrderValue - previousAOV) / previousAOV) * 100
      : averageOrderValue > 0 ? 100 : 0;

    // Process payment method data
    const revenueByPaymentMethod = paymentMethodStats.map(stat => ({
      method: stat.status.charAt(0).toUpperCase() + stat.status.slice(1),
      revenue: stat._sum.total || 0,
    }));

    // Process top customers data
    const processedTopCustomers = (topCustomers as TopCustomer[]).map(customer => {
      const totalSpent = customer.orders.reduce((sum: number, order: Order) => sum + order.total, 0);
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        orderCount: customer.orders.length,
        totalSpent,
        averageOrder: customer.orders.length > 0 ? totalSpent / customer.orders.length : 0,
        lastOrder: customer.orders[0]?.createdAt || null,
      };
    }).sort((a, b) => b.totalSpent - a.totalSpent);

    // Calculate daily metrics
    const dailyRevenueValue = dailyRevenue._sum.total || 0;
    const previousDayRevenueValue = previousDayRevenue._sum.total || 0;
    const dailyRevenueTrend = previousDayRevenueValue > 0
      ? ((dailyRevenueValue - previousDayRevenueValue) / previousDayRevenueValue) * 100
      : dailyRevenueValue > 0 ? 100 : 0;

    // Calculate projected revenue
    const daysInPeriod = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const dailyAverage = totalRevenue / daysInPeriod;
    let projectedRevenue = 0;

    switch (timeRange) {
      case 'day':
        projectedRevenue = dailyAverage * 24 / now.getHours();
        break;
      case 'week':
        projectedRevenue = dailyAverage * 7;
        break;
      case 'month':
        projectedRevenue = dailyAverage * 30;
        break;
      case 'year':
        projectedRevenue = dailyAverage * 365;
        break;
    }

    const projectedRevenueTrend = totalRevenue > 0
      ? ((projectedRevenue - totalRevenue) / totalRevenue) * 100
      : projectedRevenue > 0 ? 100 : 0;

    return NextResponse.json({
      totalRevenue,
      revenueTrend,
      averageOrderValue,
      aovTrend,
      revenueByPaymentMethod,
      topCustomers: processedTopCustomers,
      dailyRevenue: dailyRevenueValue,
      dailyRevenueTrend,
      projectedRevenue,
      projectedRevenueTrend,
    });
  } catch (error) {
    console.error('Error fetching revenue stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue stats' },
      { status: 500 }
    );
  }
} 