import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Order {
  total: number;
  createdAt: Date;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "week";

    // Calculate the date range based on the selected time range
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "day":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Fetch orders within the date range
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: now,
        },
      },
      select: {
        total: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group orders by date and calculate daily revenue
    const revenueByDate = orders.reduce((acc: { [key: string]: number }, order: Order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + Number(order.total);
      return acc;
    }, {});

    // Format the data for the chart
    const revenueData = Object.entries(revenueByDate).map(([date, revenue]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      revenue,
    }));

    return NextResponse.json(revenueData);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
} 