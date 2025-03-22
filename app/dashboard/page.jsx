'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  AlertCircle,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { colors, typography, spacing, shadows, transitions } from '../styles/design-system';

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
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsResponse, ordersResponse, customersResponse] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/orders/recent'),
          fetch('/api/users/recent'),
        ]);

        if (!statsResponse.ok || !ordersResponse.ok || !customersResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const statsData = await statsResponse.json();
        const ordersData = await ordersResponse.json();
        const customersData = await customersResponse.json();

        console.log("CUSTOMERS ---------", customersData)

        setStats(statsData);
        setRecentOrders(ordersData);
        setRecentCustomers(customersData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ShoppingBag}
          title="Total Orders"
          value={stats.totalOrders.toString()}
          color="accent-gold"
          trend={stats.orderTrend}
        />
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          color="accent-silver"
          trend={stats.revenueTrend}
        />
        <StatCard
          icon={Users}
          title="Total Customers"
          value={stats.totalCustomers.toString()}
          color="accent-bronze"
          trend={stats.customerTrend}
        />
        <StatCard
          icon={TrendingUp}
          title="Avg. Order Value"
          value={`$${stats.averageOrderValue.toFixed(2)}`}
          color="accent-gold"
          trend={stats.aovTrend}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className={`${typography.h3} text-gray-900 mb-6`}>Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-accent-gold/10 rounded-full">
                    <ShoppingBag className="h-5 w-5 text-accent-gold" />
                  </div>
                  <div>
                    <p className={`${typography.body} font-medium text-gray-900`}>
                      Order #{order.id}
                    </p>
                    <p className={`${typography.small} text-gray-500`}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${typography.body} font-medium text-gray-900`}>
                    ${order.total.toFixed(2)}
                  </p>
                  <p className={`${typography.small} ${getStatusColor(order.status)}`}>
                    {order.status}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className={`${typography.h3} text-gray-900 mb-6`}>Recent Customers</h2>
          <div className="space-y-4">
            {recentCustomers.map((customer) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-accent-silver/10 rounded-full">
                    <Users className="h-5 w-5 text-accent-silver" />
                  </div>
                  <div>
                    <p className={`${typography.body} font-medium text-gray-900`}>
                      {customer.name}
                    </p>
                    <p className={`${typography.small} text-gray-500`}>
                      {customer.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${typography.body} font-medium text-gray-900`}>
                    {customer.totalOrders} orders
                  </p>
                  <p className={`${typography.small} text-gray-500`}>
                    Joined {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`${typography.h3} text-gray-900`}>Pending Orders</h2>
            <span className="px-3 py-1 bg-accent-gold/10 text-accent-gold rounded-full text-sm font-medium">
              {stats.pendingOrders} orders
            </span>
          </div>
          <div className="space-y-4">
            {recentOrders
              .filter(order => order.status === 'processing')
              .slice(0, 5)
              .map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className={`${typography.body} font-medium text-gray-900`}>
                      Order #{order.id}
                    </p>
                    <p className={`${typography.small} text-gray-500`}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`${typography.body} font-medium text-gray-900`}>
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`${typography.h3} text-gray-900`}>Low Stock Items</h2>
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
              {stats.lowStockItems} items
            </span>
          </div>
          <div className="space-y-4">
            {stats.lowStockProducts?.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className={`${typography.body} font-medium text-gray-900`}>
                    {product.name}
                  </p>
                  <p className={`${typography.small} text-gray-500`}>
                    SKU: {product.sku}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`${typography.body} font-medium text-red-600`}>
                    {product.stock} left
                  </p>
                  <p className={`${typography.small} text-gray-500`}>
                    Threshold: {product.stockThreshold}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${color}/10 rounded-full`}>
          <Icon className={`h-6 w-6 text-${color}`} />
        </div>
        {trend && (
          <div className={`flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className={`${typography.h3} text-gray-900 mb-1`}>{value}</h3>
      <p className={`${typography.body} text-gray-500`}>{title}</p>
    </motion.div>
  );
}

function getStatusColor(status) {
  const colors = {
    processing: 'text-accent-gold',
    shipped: 'text-blue-500',
    delivered: 'text-green-500',
    cancelled: 'text-red-500',
  };
  return colors[status] || 'text-gray-500';
} 