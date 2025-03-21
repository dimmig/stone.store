'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useCart } from '@/app/providers/CartProvider';

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const sessionId = searchParams.get('session_id');
    const hasClearedCart = useRef(false);

    useEffect(() => {
        const clearCartAsync = async () => {
            if (sessionId && !hasClearedCart.current) {
                console.log('Clearing cart...');
                hasClearedCart.current = true;
                await clearCart();
                console.log('Cart cleared successfully');
            }
        };

        clearCartAsync();
    }, [sessionId, clearCart]);

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-3xl text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100"
                >
                    <CheckCircle className="h-12 w-12 text-green-600" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4 text-4xl font-bold text-gray-900"
                >
                    Thank you for your order!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8 text-lg text-gray-600"
                >
                    We've received your order and will send you a confirmation email shortly.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-x-4"
                >
                    <a
                        href="/store"
                        className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                        Continue Shopping
                    </a>
                    <a
                        href="/orders"
                        className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:border-black"
                    >
                        View Orders
                    </a>
                </motion.div>
            </motion.div>
        </div>
    );
}
