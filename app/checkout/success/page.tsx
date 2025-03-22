'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package } from 'lucide-react';
import { typography } from '@/app/styles/design-system';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
            setError('Invalid checkout session');
            setIsLoading(false);
            return;
        }

        // Wait a bit to allow the webhook to process
        setTimeout(async () => {
            try {
                const response = await fetch('/api/orders/recent');
                if (!response.ok) {
                    throw new Error('Failed to fetch order');
                }

                const orders = await response.json();
                if (orders.length > 0) {
                    setOrder(orders[0]); // Get the most recent order
                } else {
                    setError('Order not found');
                }
            } catch (error) {
                setError('Something went wrong');
                console.error('Error fetching order:', error);
            } finally {
                setIsLoading(false);
            }
        }, 2000); // Wait 2 seconds
    }, [searchParams]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-gold mx-auto"></div>
                    <p className={`${typography.body} text-gray-500 mt-4`}>
                        Processing your order...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <Package className="h-12 w-12 mx-auto" />
                    </div>
                    <h1 className={`${typography.h2} text-gray-900 mb-2`}>
                        Oops! Something went wrong
                    </h1>
                    <p className={`${typography.body} text-gray-500 mb-6`}>{error}</p>
                    <Link
                        href="/dashboard/orders"
                        className="inline-block bg-accent-gold text-white px-6 py-3 rounded-full hover:bg-accent-gold-dark transition-colors duration-300"
                    >
                        View Your Orders
                    </Link>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 mb-4">
                        <Package className="h-12 w-12 mx-auto" />
                    </div>
                    <h1 className={`${typography.h2} text-gray-900 mb-2`}>
                        Order Not Found
                    </h1>
                    <p className={`${typography.body} text-gray-500 mb-6`}>
                        We couldn't find your order. Please check your orders page.
                    </p>
                    <Link
                        href="/dashboard/orders"
                        className="inline-block bg-accent-gold text-white px-6 py-3 rounded-full hover:bg-accent-gold-dark transition-colors duration-300"
                    >
                        View Your Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full bg-white rounded-lg shadow-sm p-8"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-green-500 mb-4"
                    >
                        <CheckCircle className="h-16 w-16 mx-auto" />
                    </motion.div>
                    <h1 className={`${typography.h2} text-gray-900 mb-2`}>
                        Order Confirmed!
                    </h1>
                    <p className={`${typography.body} text-gray-500`}>
                        Thank you for your purchase. Your order has been received.
                    </p>
                </div>

                <div className="border-t border-gray-100 pt-6 mb-6">
                    <div className="flex justify-between mb-4">
                        <p className={`${typography.body} text-gray-500`}>Order Number:</p>
                        <p className={`${typography.body} text-gray-900 font-medium`}>
                            #{order.id}
                        </p>
                    </div>
                    <div className="flex justify-between mb-4">
                        <p className={`${typography.body} text-gray-500`}>Order Status:</p>
                        <p className={`${typography.body} text-accent-gold font-medium`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <p className={`${typography.body} text-gray-500`}>Total Amount:</p>
                        <p className={`${typography.body} text-gray-900 font-medium`}>
                            ${order.total.toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Link
                        href="/dashboard/orders"
                        className="inline-block bg-accent-gold text-white px-6 py-3 rounded-full hover:bg-accent-gold-dark transition-colors duration-300"
                    >
                        View Order Details
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
