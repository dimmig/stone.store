"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { typography } from '../../styles/design-system';
import { ChevronDown, ShoppingBag, CreditCard, Truck, RefreshCw, Shield, Mail, Phone, Clock } from 'lucide-react';

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

const faqCategories = [
    {
        icon: ShoppingBag,
        title: 'Shopping',
        questions: [
            {
                question: 'How do I place an order?',
                answer: 'To place an order, simply browse our products, select your desired items, add them to your cart, and proceed to checkout. Follow the prompts to enter your shipping and payment information.'
            },
            {
                question: 'How do I track my order?',
                answer: "Once your order ships, you'll receive a tracking number via email. You can use this number to track your order status on our website or the shipping carrier's website."
            },
            {
                question: 'Can I modify my order after it\'s placed?',
                answer: 'Orders can be modified within 1 hour of placement. After that, please contact our customer service team for assistance.'
            }
        ]
    },
    {
        icon: CreditCard,
        title: 'Payment',
        questions: [
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay.'
            },
            {
                question: 'Is my payment information secure?',
                answer: 'Yes, we use industry-standard encryption to protect your payment information. We never store your full credit card details on our servers.'
            },
            {
                question: 'Do you offer payment plans?',
                answer: 'Yes, we offer payment plans through our partner, Klarna. You can select this option at checkout.'
            }
        ]
    },
    {
        icon: Truck,
        title: 'Shipping',
        questions: [
            {
                question: 'How long does shipping take?',
                answer: 'Standard shipping takes 3-5 business days, while express shipping delivers in 1-2 business days. International shipping times vary by destination.'
            },
            {
                question: 'Do you ship internationally?',
                answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.'
            },
            {
                question: 'Can I change my shipping address?',
                answer: 'You can change your shipping address within 1 hour of placing your order. After that, please contact our customer service team.'
            }
        ]
    },
    {
        icon: RefreshCw,
        title: 'Returns',
        questions: [
            {
                question: 'What is your return policy?',
                answer: 'We offer a 30-day return window for most items. Items must be unworn, unwashed, and have all original tags attached.'
            },
            {
                question: 'How do I initiate a return?',
                answer: 'Log into your account, select the item to return, and follow the prompts to print a return shipping label.'
            },
            {
                question: 'How long does it take to receive a refund?',
                answer: 'Refunds are typically processed within 5-7 business days after we receive and inspect your return.'
            }
        ]
    },
    {
        icon: Shield,
        title: 'Security',
        questions: [
            {
                question: 'How do you protect my personal information?',
                answer: 'We use industry-standard encryption and security measures to protect your personal information. We never share your data with third parties without your consent.'
            },
            {
                question: 'Is my account secure?',
                answer: 'Yes, we use secure authentication methods and encourage strong passwords. We also offer two-factor authentication for additional security.'
            },
            {
                question: 'How can I update my account information?',
                answer: 'You can update your account information by logging into your account and accessing the settings section.'
            }
        ]
    },
    {
        icon: Mail,
        title: 'Contact',
        questions: [
            {
                question: 'How can I contact customer service?',
                answer: 'You can reach our customer service team via email at support@stonestore.com, phone at +1 (555) 123-4567, or through our contact form.'
            },
            {
                question: 'What are your customer service hours?',
                answer: 'Our customer service team is available 24/7 to assist you with any questions or concerns.'
            },
            {
                question: 'Do you offer live chat support?',
                answer: 'Yes, we offer live chat support during business hours. Look for the chat icon in the bottom right corner of our website.'
            }
        ]
    }
];

export default function FAQPage() {
    const [openCategory, setOpenCategory] = useState<string | null>(null);
    const [openQuestions, setOpenQuestions] = useState<{ [key: string]: boolean }>({});

    const toggleCategory = (category: string) => {
        setOpenCategory(openCategory === category ? null : category);
    };

    const toggleQuestion = (questionId: string) => {
        setOpenQuestions(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

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
                        Frequently Asked Questions
                    </h1>
                    <p className={`${typography.body} text-gray-200 mb-8 max-w-2xl mx-auto`}>
                        Find answers to common questions about our products, services, and policies.
                    </p>
                </motion.div>
            </section>

            {/* FAQ Categories Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {faqCategories.map((category, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white rounded-2xl shadow-sm overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleCategory(category.title)}
                                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                                            <category.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className={`${typography.h4} text-gray-900`}>{category.title}</h3>
                                    </div>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-500 transition-transform ${
                                            openCategory === category.title ? 'transform rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openCategory === category.title && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="border-t"
                                        >
                                            <div className="p-6 space-y-4">
                                                {category.questions.map((faq, qIndex) => (
                                                    <div key={qIndex} className="border-b last:border-0 pb-4 last:pb-0">
                                                        <button
                                                            onClick={() => toggleQuestion(`${category.title}-${qIndex}`)}
                                                            className="w-full text-left flex items-center justify-between"
                                                        >
                                                            <h4 className={`${typography.h5} text-gray-900`}>{faq.question}</h4>
                                                            <ChevronDown
                                                                className={`w-5 h-5 text-gray-500 transition-transform ${
                                                                    openQuestions[`${category.title}-${qIndex}`] ? 'transform rotate-180' : ''
                                                                }`}
                                                            />
                                                        </button>
                                                        <AnimatePresence>
                                                            {openQuestions[`${category.title}-${qIndex}`] && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.3 }}
                                                                >
                                                                    <p className={`${typography.body} text-gray-600 mt-2`}>
                                                                        {faq.answer}
                                                                    </p>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Contact Support Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className={`${typography.h2} text-gray-900 mb-4`}>Still Have Questions?</h2>
                        <p className={`${typography.body} text-gray-500 mb-8`}>
                            Our customer service team is here to help you with any questions or concerns.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="mailto:support@stonestore.com"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                            >
                                <Mail className="w-5 h-5 mr-2" />
                                Email Support
                            </a>
                            <a
                                href="tel:+15551234567"
                                className="inline-flex items-center px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300"
                            >
                                <Phone className="w-5 h-5 mr-2" />
                                Call Us
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
} 