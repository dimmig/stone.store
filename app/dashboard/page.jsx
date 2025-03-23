"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  ChevronRight,
  Minus,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import {
  colors,
  typography,
  spacing,
  shadows,
  transitions,
} from "../styles/design-system";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    orderTrend: 0,
    revenueTrend: 0,
    customerTrend: 0,
    aovTrend: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [timeRange, setTimeRange] = useState("week"); // 'day', 'week', 'month', 'year'
  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [
          statsResponse,
          ordersResponse,
          customersResponse,
          revenueResponse,
        ] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/orders/recent"),
          fetch("/api/users/recent"),
          fetch(`/api/dashboard/revenue?timeRange=${timeRange}`),
        ]);

        if (
          !statsResponse.ok ||
          !ordersResponse.ok ||
          !customersResponse.ok ||
          !revenueResponse.ok
        ) {
          throw new Error("Failed to fetch dashboard data");
        }

        const statsData = await statsResponse.json();
        const ordersData = await ordersResponse.json();
        const customersData = await customersResponse.json();
        const revenueData = await revenueResponse.json();

        console.log("CUSTOMERS ---------", customersData);

        setStats(statsData);
        setRecentOrders(ordersData);
        setRecentCustomers(customersData);

        // Process revenue data for the chart
        const processedRevenueData = revenueData.map((item) => ({
          name: item.date,
          value: item.revenue,
        }));
        setRevenueData(processedRevenueData);

        // Process order status data for the pie chart
        const orderStatuses = ordersData.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {});

        const totalOrders = ordersData.length;
        const processedOrderStatusData = Object.entries(orderStatuses).map(
          ([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: Math.round((count / totalOrders) * 100),
          })
        );
        setOrderStatusData(processedOrderStatusData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  const COLORS = ["#FFB800", "#4F46E5", "#10B981", "#EF4444"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {session?.user?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-0"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          trend={stats.revenueTrend}
          icon={DollarSign}
          color="accent-gold"
        />
        <MetricCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          trend={stats.orderTrend}
          icon={ShoppingBag}
          color="accent-silver"
        />
        <MetricCard
          title="Total Customers"
          value={stats.totalCustomers.toString()}
          trend={stats.customerTrend}
          icon={Users}
          color="accent-bronze"
        />
        <MetricCard
          title="Average Order Value"
          value={`$${stats.averageOrderValue.toFixed(2)}`}
          trend={stats.aovTrend}
          icon={TrendingUp}
          color="accent-gold"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue Overview
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Revenue trends over time
              </p>
            </div>
            <Link
              href="/dashboard/revenue"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              View Details
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB800" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FFB800" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  stroke="#6B7280"
                  fontSize={12}
                  tick={{ fill: "#6B7280" }}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => `$${Math.round(value)}`}
                  tick={{ fill: "#6B7280" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    padding: "0.75rem",
                  }}
                  formatter={(value) => [`$${Math.round(value)}`, "Revenue"]}
                  labelStyle={{
                    color: "#1F2937",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="url(#colorRevenue)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Orders Overview
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Order distribution by status
              </p>
            </div>
            <Link
              href="/dashboard/orders"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              View Details
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div
              className="h-[300px] flex-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={4}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="white"
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      padding: "0.75rem",
                    }}
                    formatter={(value) => [`${Math.round(value)}%`, "Orders"]}
                    labelStyle={{
                      color: "#1F2937",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </motion.div>
            <div className="flex-1 flex flex-col justify-center gap-4">
              {orderStatusData.map((entry, index) => (
                <motion.div
                  key={entry.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {entry.name}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {Math.round(entry.value)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${entry.value}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.4 }}
                        className="h-2 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Latest customer orders
              </p>
            </div>
            <Link
              href="/dashboard/orders"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              View All Orders
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-900/10 rounded-full">
                    <ShoppingBag className="h-5 w-5 text-gray-900" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order.id}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${order.total.toFixed(2)}
                  </p>
                  <p className={`text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="space-y-6">
          {/* Pending Orders Alert */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Pending Orders
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Orders requiring attention
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gray-900/10 text-gray-900 rounded-full text-sm font-medium">
                  {stats.pendingOrders} orders
                </span>
                <Link
                  href="/dashboard/orders?status=processing"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              {recentOrders
                .filter((order) => order.status === "processing")
                .slice(0, 3)
                .map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Low Stock Items
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Products running low on inventory
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                  {stats.lowStockItems} items
                </span>
                <Link
                  href="/dashboard/products"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              {stats.lowStockProducts?.slice(0, 5).map((product) => {
                const stockStatus =
                  product.stockQuantity === 0
                    ? "Out of Stock"
                    : product.stockQuantity <= 5
                    ? "Critical Stock"
                    : product.stockQuantity <= 10
                    ? "Low Stock"
                    : "Running Low";

                const statusColor =
                  product.stockQuantity === 0
                    ? "text-red-600"
                    : product.stockQuantity <= 5
                    ? "text-orange-600"
                    : product.stockQuantity <= 10
                    ? "text-yellow-600"
                    : "text-blue-600";

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        SKU: {product.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${statusColor}`}>
                        {stockStatus}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.stockQuantity} units left
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon: Icon, color }) {
  const isPositive = trend > 0;
  const isZero = trend === 0;
  const trendColor = isZero
    ? "text-gray-500"
    : isPositive
    ? "text-green-500"
    : "text-red-500";
  const trendBg = isZero
    ? "bg-gray-50"
    : isPositive
    ? "bg-green-50"
    : "bg-red-50";
  const TrendIcon = isZero ? Minus : isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${color}/10 rounded-full`}>
          <Icon className={`h-6 w-6 text-${color}`} />
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-1 ${trendBg}`}
        >
          <TrendIcon className={`h-4 w-4 ${trendColor}`} />
          <span className={`text-xs font-medium ${trendColor}`}>
            {Math.abs(trend)}%
          </span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-500">{title}</p>
    </motion.div>
  );
}

function getStatusColor(status) {
  const colors = {
    processing: "text-accent-gold",
    shipped: "text-blue-500",
    delivered: "text-green-500",
    cancelled: "text-red-500",
  };
  return colors[status] || "text-gray-500";
}
