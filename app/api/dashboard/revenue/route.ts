import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "week";

    const now = new Date();
    let startDate = new Date();
    let dateFormat = "MMM dd";

    switch (timeRange) {
      case "day":
        startDate.setHours(0, 0, 0, 0);
        dateFormat = "HH:mm";
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        dateFormat = "MMM dd";
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        dateFormat = "MMM dd";
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        dateFormat = "MMM yyyy";
        break;
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: now,
        },
      },
      select: {
        createdAt: true,
        total: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group orders by date and calculate daily revenue
    const revenueByDate = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt);
      let key;
      
      switch (timeRange) {
        case "day":
          key = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
          break;
        case "week":
        case "month":
          key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          break;
        case "year":
          key = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
          break;
      }

      acc[key] = (acc[key] || 0) + order.total;
      return acc;
    }, {});

    // Create array of dates with zero revenue for missing dates
    const dates = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= now) {
      let key;
      switch (timeRange) {
        case "day":
          key = currentDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
          break;
        case "week":
        case "month":
          key = currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          break;
        case "year":
          key = currentDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
          break;
      }
      
      dates.push({
        date: key,
        revenue: revenueByDate[key] || 0,
      });

      currentDate.setTime(currentDate.getTime() + (timeRange === "day" ? 30 * 60 * 1000 : 24 * 60 * 60 * 1000));
    }

    return NextResponse.json(dates);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
} 