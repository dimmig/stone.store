"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Clock, RefreshCw, Shield, Info } from 'lucide-react';

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

const returnSteps = [
    {
        icon: Package,
        title: 'Pack Your Item',
        description: 'Carefully pack your item in its original packaging with all tags and accessories.'
    },
    {
        icon: ArrowLeft,
        title: 'Print Return Label',
        description: 'Log into your account, select the item to return, and print the provided shipping label.'
    },
    {
        icon: RefreshCw,
        title: 'Ship Your Return',
        description: 'Drop off your package at any authorized shipping location or schedule a pickup.'
    },
    {
        icon: Shield,
        title: 'Track & Receive Refund',
        description: 'Track your return and receive your refund once the item is received and inspected.'
    }
];

const returnPolicies = [
    {
        icon: Clock,
        title: 'Return Window',
        description: 'Items can be returned within 30 days of delivery for a full refund.'
    },
    {
        icon: Shield,
        title: 'Condition Requirements',
        description: 'Items must be unworn, unwashed, and have all original tags attached.'
    },
    {
        icon: Info,
        title: 'Non-Returnable Items',
        description: 'Personal care items, underwear, and swimwear are final sale and cannot be returned.'
    }
];

const ReturnsPage: React.FC = () => {
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
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-white">
                        Returns & Exchanges
                    </h1>
                    <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
                        We want you to be completely satisfied with your purchase. Learn about our easy returns process.
                    </p>
                </motion.div>
            </section>

            {/* Return Steps Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Return</h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            Follow these simple steps to return your item.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {returnSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                                    <step.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                                <p className="text-base text-gray-600">{step.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Return Policies Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Return Policies</h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            Important information about our return process.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {returnPolicies.map((policy, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                                    <policy.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">{policy.title}</h3>
                                <p className="text-base text-gray-600">{policy.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            Find answers to common questions about our returns process.
                        </p>
                    </motion.div>

                    <motion.div
                        className="space-y-6"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {[
                            {
                                question: 'How long do I have to return an item?',
                                answer: 'You have 30 days from the date of delivery to initiate a return.'
                            },
                            {
                                question: 'Do I have to pay for return shipping?',
                                answer: 'No, we provide a free return shipping label for all eligible returns.'
                            },
                            {
                                question: 'How long does it take to receive my refund?',
                                answer: 'Refunds are typically processed within 5-7 business days after we receive and inspect your return.'
                            },
                            {
                                question: 'Can I exchange an item instead of returning it?',
                                answer: "Yes, you can exchange an item for a different size or color. The process is the same as returning, but you'll receive store credit instead of a refund."
                            }
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{faq.question}</h3>
                                <p className="text-base text-gray-600">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default ReturnsPage; 