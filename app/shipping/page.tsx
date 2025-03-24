"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { typography } from '../styles/design-system';
import { Truck, Clock, Shield, Package, MapPin, Info } from 'lucide-react';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const shippingMethods = [
    {
        icon: Truck,
        title: 'Standard Shipping',
        description: '3-5 business days',
        price: '$5.99',
        features: ['Free on orders over $50', 'Tracking included', 'Signature required']
    },
    {
        icon: Clock,
        title: 'Express Shipping',
        description: '1-2 business days',
        price: '$12.99',
        features: ['Priority handling', 'Real-time tracking', 'Guaranteed delivery']
    },
    {
        icon: Shield,
        title: 'International Shipping',
        description: '5-10 business days',
        price: 'From $15.99',
        features: ['Customs handling', 'International tracking', 'Duties included']
    }
];

const shippingInfo = [
    {
        icon: Package,
        title: 'Order Processing',
        description: 'Orders are processed within 24 hours of placement. You will receive a confirmation email with tracking information once your order ships.'
    },
    {
        icon: MapPin,
        title: 'Shipping Zones',
        description: 'We ship to all 50 states in the US and most countries worldwide. Shipping costs and delivery times vary by location.'
    },
    {
        icon: Info,
        title: 'Shipping Restrictions',
        description: 'Some items may have shipping restrictions due to size, weight, or destination. These will be clearly marked on the product page.'
    }
];

export default function ShippingPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80"></div>
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2074')] bg-cover bg-center opacity-40"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60"></div>
                </div>
                <motion.div 
                    className="relative z-10 text-center px-4 sm:px-6 lg:px-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className={`${typography.h1} text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-white`}>
                        Shipping Information
                    </h1>
                    <p className={`${typography.body} text-gray-200 mb-8 max-w-2xl mx-auto`}>
                        Learn about our shipping methods, delivery times, and policies to ensure a smooth shopping experience.
                    </p>
                </motion.div>
            </section>

            {/* Shipping Methods Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className={`${typography.h2} text-gray-900 mb-4`}>Shipping Methods</h2>
                        <p className={`${typography.body} text-gray-500 max-w-2xl mx-auto`}>
                            Choose the shipping method that best suits your needs.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {shippingMethods.map((method, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                                    <method.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className={`${typography.h4} text-gray-900 mb-2`}>{method.title}</h3>
                                <p className={`${typography.body} text-gray-500 mb-4`}>{method.description}</p>
                                <p className={`${typography.h4} text-purple-600 mb-6`}>{method.price}</p>
                                <ul className="space-y-2">
                                    {method.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-gray-600">
                                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Shipping Info Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className={`${typography.h2} text-gray-900 mb-4`}>Important Information</h2>
                        <p className={`${typography.body} text-gray-500 max-w-2xl mx-auto`}>
                            Everything you need to know about our shipping process.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {shippingInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                                    <info.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className={`${typography.h4} text-gray-900 mb-4`}>{info.title}</h3>
                                <p className={`${typography.body} text-gray-600`}>{info.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
} 