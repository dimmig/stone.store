"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { typography } from '../styles/design-system';
import { Users, Award, Heart, Leaf, Recycle, Target, Clock } from 'lucide-react';
import Image from 'next/image';

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

const values = [
    {
        icon: Target,
        title: 'Our Mission',
        description: 'To provide sustainable, high-quality fashion that empowers individuals to express their unique style while making a positive impact on the environment.'
    },
    {
        icon: Heart,
        title: 'Our Values',
        description: 'We believe in ethical production, fair wages, and creating a positive impact in the communities we serve.'
    },
    {
        icon: Leaf,
        title: 'Sustainability',
        description: 'We\'re committed to reducing our environmental footprint through sustainable materials and responsible manufacturing.'
    },
    {
        icon: Recycle,
        title: 'Circular Fashion',
        description: 'We promote circular fashion through our recycling program and encourage responsible consumption.'
    }
];

const stats = [
    { icon: Users, value: '10K+', label: 'Happy Customers' },
    { icon: Award, value: '98%', label: 'Success Rate' },
    { icon: Clock, value: '24/7', label: 'Support' }
];

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
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
                        Our Story
                    </h1>
                    <p className={`${typography.body} text-gray-200 mb-8 max-w-2xl mx-auto`}>
                        Founded in 2024, Stone Store has been at the forefront of sustainable fashion, 
                        combining style with environmental responsibility.
                    </p>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl hover:bg-white/80 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className={`${typography.h3} text-gray-900 mb-2`}>{stat.value}</h3>
                                <p className={`${typography.body} text-gray-500`}>{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className={`${typography.h2} text-gray-900 mb-4`}>Our Values</h2>
                        <p className={`${typography.body} text-gray-500 max-w-2xl mx-auto`}>
                            We're committed to making a positive impact through sustainable fashion.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                                    <value.icon className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className={`${typography.h4} text-gray-900 mb-4`}>{value.title}</h3>
                                <p className={`${typography.body} text-gray-600`}>
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className={`${typography.h2} text-gray-900 mb-4`}>Our Team</h2>
                        <p className={`${typography.body} text-gray-500 max-w-2xl mx-auto`}>
                            Meet the passionate individuals behind Stone Store.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {[1, 2, 3].map((member, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="text-center"
                            >
                                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                                    <Image
                                        src={`https://images.unsplash.com/photo-${1500000000000 + index}?w=500&h=500&fit=crop`}
                                        alt={`Team member ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className={`${typography.h4} text-gray-900 mb-2`}>John Doe</h3>
                                <p className={`${typography.body} text-gray-500`}>Founder & CEO</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
} 