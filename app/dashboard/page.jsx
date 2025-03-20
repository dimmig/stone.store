'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Edit2,
} from 'lucide-react';
import { colors, typography, spacing, shadows, transitions } from '../styles/design-system';

export default function DashboardPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    birthday: 'January 1, 1990',
  });

  const recentOrders = [
    {
      id: 'ORD-001',
      date: '2024-03-15',
      total: 299.99,
      status: 'Delivered',
      items: ['Diamond Solitaire Ring', 'Gold Chain Necklace'],
    },
    // Add more orders as needed
  ];

  const wishlistItems = [
    {
      id: 1,
      name: 'Sapphire Engagement Ring',
      price: 3999.99,
      image: '/images/products/ring-2.jpg',
    },
    // Add more wishlist items as needed
  ];

  const savedAddresses = [
    {
      id: 1,
      name: 'Home',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      isDefault: true,
    },
    // Add more addresses as needed
  ];

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className={`${typography.h2} text-gray-900`}>Profile</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 text-accent-gold hover:text-accent-gold-dark transition-colors duration-300"
          >
            <Edit2 className="h-4 w-4" />
            <span className={`${typography.body} font-medium`}>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className={`${typography.body} text-gray-600 block mb-1`}>
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                />
              ) : (
                <p className={`${typography.body} text-gray-900`}>
                  {userData.name}
                </p>
              )}
            </div>

            <div>
              <label className={`${typography.body} text-gray-600 block mb-1`}>
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                />
              ) : (
                <p className={`${typography.body} text-gray-900`}>
                  {userData.email}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`${typography.body} text-gray-600 block mb-1`}>
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                />
              ) : (
                <p className={`${typography.body} text-gray-900`}>
                  {userData.phone}
                </p>
              )}
            </div>

            <div>
              <label className={`${typography.body} text-gray-600 block mb-1`}>
                Birthday
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={userData.birthday}
                  onChange={(e) =>
                    setUserData({ ...userData, birthday: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                />
              ) : (
                <p className={`${typography.body} text-gray-900`}>
                  {userData.birthday}
                </p>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 px-6 py-3 bg-accent-gold text-white rounded-full hover:bg-accent-gold-dark transition-colors duration-300"
          >
            Save Changes
          </motion.button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ShoppingBag}
          title="Total Orders"
          value="12"
          color="accent-gold"
        />
        <StatCard
          icon={Heart}
          title="Wishlist Items"
          value="8"
          color="accent-silver"
        />
        <StatCard
          icon={MapPin}
          title="Saved Addresses"
          value="3"
          color="accent-bronze"
        />
        <StatCard
          icon={CreditCard}
          title="Payment Methods"
          value="2"
          color="accent-gold"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className={`${typography.h3} text-gray-900 mb-6`}>Recent Activity</h2>
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
                  <p className={`${typography.body} text-gray-500`}>
                    {order.items.join(', ')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`${typography.body} font-medium text-gray-900`}>
                  ${order.total.toFixed(2)}
                </p>
                <p className={`${typography.body} text-gray-500`}>{order.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 bg-${color}/10 rounded-full`}>
          <Icon className={`h-6 w-6 text-${color}`} />
        </div>
        <div>
          <p className={`${typography.body} text-gray-500`}>{title}</p>
          <p className={`${typography.h4} text-gray-900`}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
} 