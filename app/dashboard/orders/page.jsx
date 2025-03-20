'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { colors, typography, spacing, shadows, transitions } from '../../styles/design-system';

const orderStatuses = {
  processing: {
    icon: Clock,
    color: 'text-accent-gold',
    bgColor: 'bg-accent-gold/10',
  },
  shipped: {
    icon: Truck,
    color: 'text-accent-silver',
    bgColor: 'bg-accent-silver/10',
  },
  delivered: {
    icon: CheckCircle,
    color: 'text-accent-bronze',
    bgColor: 'bg-accent-bronze/10',
  },
};

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  const orders = [
    {
      id: 'ORD-001',
      date: '2024-03-15',
      total: 299.99,
      status: 'delivered',
      items: [
        {
          id: 1,
          name: 'Diamond Solitaire Ring',
          price: 199.99,
          quantity: 1,
          image: '/images/products/ring-1.jpg',
        },
        {
          id: 2,
          name: 'Gold Chain Necklace',
          price: 100.00,
          quantity: 1,
          image: '/images/products/necklace-1.jpg',
        },
      ],
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
      },
      trackingNumber: '1Z999AA1234567890',
    },
    // Add more orders as needed
  ];

  const filteredOrders = orders.filter(
    (order) => filter === 'all' || order.status === filter
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className={`${typography.h2} text-gray-900 mb-4 sm:mb-0`}>
          Order History
        </h1>
        <div className="flex space-x-2">
          {Object.keys(orderStatuses).map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                filter === status
                  ? 'bg-accent-gold text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            {/* Order Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${orderStatuses[order.status].bgColor}`}>
                    {React.createElement(orderStatuses[order.status].icon, {
                      className: `h-5 w-5 ${orderStatuses[order.status].color}`,
                    })}
                  </div>
                  <div>
                    <p className={`${typography.body} font-medium text-gray-900`}>
                      Order #{order.id}
                    </p>
                    <p className={`${typography.body} text-gray-500`}>
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className={`${typography.h5} text-gray-900`}>
                    ${order.total.toFixed(2)}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setSelectedOrder(
                        selectedOrder?.id === order.id ? null : order
                      )
                    }
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
                  >
                    <ChevronRight
                      className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${
                        selectedOrder?.id === order.id ? 'rotate-90' : ''
                      }`}
                    />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Order Details */}
            {selectedOrder?.id === order.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6 space-y-6"
              >
                {/* Items */}
                <div>
                  <h3 className={`${typography.h4} text-gray-900 mb-4`}>
                    Items
                  </h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className={`${typography.body} font-medium text-gray-900`}>
                            {item.name}
                          </p>
                          <p className={`${typography.body} text-gray-500`}>
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className={`${typography.body} text-gray-900`}>
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className={`${typography.h4} text-gray-900 mb-4`}>
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className={`${typography.body} text-gray-900`}>
                      {order.shippingAddress.name}
                    </p>
                    <p className={`${typography.body} text-gray-500`}>
                      {order.shippingAddress.street}
                    </p>
                    <p className={`${typography.body} text-gray-500`}>
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.zip}
                    </p>
                  </div>
                </div>

                {/* Tracking */}
                {order.trackingNumber && (
                  <div>
                    <h3 className={`${typography.h4} text-gray-900 mb-4`}>
                      Tracking Information
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Package className="h-5 w-5 text-accent-gold" />
                      <p className={`${typography.body} text-gray-900`}>
                        Tracking Number: {order.trackingNumber}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block p-4 rounded-full bg-accent-gold/10 mb-4">
            <ShoppingBag className="h-8 w-8 text-accent-gold" />
          </div>
          <h3 className={`${typography.h4} text-gray-900 mb-2`}>
            No orders found
          </h3>
          <p className={`${typography.body} text-gray-500 mb-4`}>
            {filter === 'all'
              ? "You haven't placed any orders yet."
              : `No ${filter} orders found.`}
          </p>
          <Link href="/store">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-accent-gold text-white rounded-full hover:bg-accent-gold-dark transition-colors duration-300"
            >
              Start Shopping
            </motion.button>
          </Link>
        </div>
      )}
    </div>
  );
} 