"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Calendar,
  RefreshCw,
  ShoppingBag,
  Users,
  CreditCard,
  Wallet,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { typography } from "../../styles/design-system";

export default function RevenuePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [revenueData, setRevenueData] = useState([]);
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    revenueTrend: 0,
    averageOrderValue: 0,
    aovTrend: 0,
    revenueByPaymentMethod: [],
    topCustomers: [],
    dailyRevenue: 0,
    dailyRevenueTrend: 0,
    projectedRevenue: 0,
    projectedRevenueTrend: 0,
  });

  const fetchRevenueData = async () => {
    try {
      setIsLoading(true);
      const [revenueResponse, statsResponse] = await Promise.all([
        fetch(`/api/dashboard/revenue?timeRange=${timeRange}`),
        fetch(`/api/dashboard/revenue/stats?timeRange=${timeRange}`),
      ]);

      if (!revenueResponse.ok || !statsResponse.ok) {
        throw new Error("Failed to fetch revenue data");
      }

      const revenueData = await revenueResponse.json();
      const statsData = await statsResponse.json();

      setRevenueData(revenueData);
      setRevenueStats(statsData);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRevenueData();
  };

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
            Revenue Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Detailed revenue insights and trends
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <RefreshCw
              className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
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
          value={revenueStats.totalRevenue.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          trend={revenueStats.revenueTrend}
          icon={DollarSign}
          color="accent-gold"
        />
        <MetricCard
          title="Daily Revenue"
          value={revenueStats.dailyRevenue.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          trend={revenueStats.dailyRevenueTrend}
          icon={Wallet}
          color="accent-silver"
        />
        <MetricCard
          title="Average Order Value"
          value={revenueStats.averageOrderValue.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          trend={revenueStats.aovTrend}
          icon={ShoppingBag}
          color="accent-bronze"
        />
        <MetricCard
          title="Projected Revenue"
          value={revenueStats.projectedRevenue.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          trend={revenueStats.projectedRevenueTrend}
          icon={TrendingUp}
          color="accent-gold"
        />
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Trend Chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue Trend
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Revenue performance over time
              </p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB800" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FFB800" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  fontSize={12}
                  tick={{ fill: "#6B7280" }}
                  interval={timeRange === "day" ? 2 : 0}
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
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                  labelStyle={{
                    color: "#1F2937",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FFB800"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue by Payment Method
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Distribution across payment types
              </p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueStats.revenueByPaymentMethod}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="method"
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
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                  labelStyle={{
                    color: "#1F2937",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                  }}
                />
                <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Top Customers by Revenue
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Highest spending customers
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-sm font-medium text-gray-500">
                  Customer
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-500">
                  Orders
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-500">
                  Total Spent
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-500">
                  Average Order
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-500">
                  Last Order
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {revenueStats.topCustomers.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-accent-gold/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-accent-gold" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-900">
                      {customer.orderCount}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-900">
                      {customer.totalSpent.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-900">
                      {customer.averageOrder.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-900">
                      {new Date(customer.lastOrder).toLocaleDateString()}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend = 0, icon: Icon, color }) {
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
            {trend ? `${Math.abs(trend).toFixed(1)}%` : "0%"}
          </span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-500">{title}</p>
    </motion.div>
  );
}
