"use client"
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Star, Truck, Shield, Heart, Instagram, Facebook, Twitter, Youtube, Users, TrendingUp, Award, Clock, ChevronDown, Check, Leaf, Recycle } from 'lucide-react';
import { typography } from './styles/design-system';

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

const features = [
    {
        icon: ShoppingBag,
        title: 'Curated Collections',
        description: 'Discover our carefully selected pieces that blend style and comfort.'
    },
    {
        icon: Star,
        title: 'Premium Quality',
        description: 'Experience luxury with our high-quality materials and craftsmanship.'
    },
    {
        icon: Truck,
        title: 'Fast Delivery',
        description: 'Quick and reliable shipping to bring your style to life.'
    },
    {
        icon: Shield,
        title: 'Secure Shopping',
        description: 'Shop with confidence with our secure payment system.'
    }
];

const stats = [
    { icon: Users, value: '10K+', label: 'Happy Customers' },
    { icon: TrendingUp, value: '98%', label: 'Success Rate' },
    { icon: Award, value: '24/7', label: 'Support' },
    { icon: Clock, value: '2-3', label: 'Days Delivery' }
];

const testimonials = [
    {
        name: 'Sarah Johnson',
        role: 'Fashion Enthusiast',
        image: '/images/testimonials/sarah.jpg',
        text: 'The quality of products and customer service is exceptional. I love how they curate their collections!'
    },
    {
        name: 'Michael Chen',
        role: 'Style Blogger',
        image: '/images/testimonials/michael.jpg',
        text: 'Stone Store has become my go-to destination for premium fashion. Their attention to detail is unmatched.'
    },
    {
        name: 'Emma Davis',
        role: 'Professional Stylist',
        image: '/images/testimonials/emma.jpg',
        text: 'The variety of styles and the quality of materials make this store stand out. Highly recommended!'
    }
];

const categories = [
    {
        name: 'Clothing',
        image: '/images/categories/clothing.jpg',
        description: 'Discover our latest fashion trends'
    },
    {
        name: 'Accessories',
        image: '/images/categories/accessories.jpg',
        description: 'Complete your look with style'
    },
    {
        name: 'Footwear',
        image: '/images/categories/footwear.jpg',
        description: 'Step into comfort and style'
    }
];

const trendingProducts = [
    {
        name: 'Classic White Sneakers',
        price: 129.99,
        image: '/images/products/sneakers.jpg',
        category: 'Footwear'
    },
    {
        name: 'Leather Crossbody Bag',
        price: 159.99,
        image: '/images/products/bag.jpg',
        category: 'Accessories'
    },
    {
        name: 'Denim Jacket',
        price: 89.99,
        image: '/images/products/jacket.jpg',
        category: 'Clothing'
    }
];

const faqs = [
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, PayPal, and Apple Pay. All transactions are secure and encrypted."
    },
    {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 2-3 business days within the US. International shipping varies by location."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for all unused items in their original packaging."
    },
    {
        question: "Do you offer international shipping?",
        answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location."
    }
];

const pricingPlans = [
    {
        name: "Basic",
        price: "Free",
        features: [
            "Access to basic products",
            "Standard shipping",
            "Email support",
            "Basic returns"
        ],
        cta: "Get Started"
    },
    {
        name: "Premium",
        price: "$9.99",
        period: "/month",
        features: [
            "Access to all products",
            "Free shipping",
            "Priority support",
            "Extended returns",
            "Exclusive deals"
        ],
        cta: "Upgrade Now",
        popular: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        features: [
            "Custom solutions",
            "Dedicated support",
            "Bulk ordering",
            "Custom branding",
            "API access"
        ],
        cta: "Contact Sales"
    }
];

export default function LandingPage() {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
    const [openFaq, setOpenFaq] = React.useState<number | null>(null);

    return (
        <div className="min-h-screen">
            {/* Animated Background */}
            <motion.div 
                className="fixed inset-0 z-0"
            >
                {/* Base Layer - Light Theme */}
                <div className="absolute inset-0 bg-gray-50"></div>
                
                {/* Subtle Mesh Gradient */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.03),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.02),transparent_50%)]"></div>
                </div>

                {/* Subtle Grid */}
                <div 
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
                    }}
                ></div>

                {/* Subtle Light Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-purple-100/50 rounded-full mix-blend-multiply filter blur-[150px] animate-pulse"></div>
                    <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-blue-100/50 rounded-full mix-blend-multiply filter blur-[150px] animate-pulse animation-delay-2000"></div>
                </div>

                {/* Subtle Floating Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute h-40 w-40 rounded-full border border-gray-100"
                        style={{
                            top: '15%',
                            left: '25%',
                            background: 'radial-gradient(circle at center, rgba(0,0,0,0.02), transparent)',
                        }}
                        animate={{
                            y: [0, -30, 0],
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                    <motion.div
                        className="absolute h-32 w-32 rounded-full border border-gray-100"
                        style={{
                            top: '70%',
                            right: '20%',
                            background: 'radial-gradient(circle at center, rgba(0,0,0,0.02), transparent)',
                        }}
                        animate={{
                            y: [0, 30, 0],
                            rotate: [360, 0]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>
            </motion.div>

            {/* Hero Section - Enhanced */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80"></div>
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2074')] bg-cover bg-center opacity-40"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60"></div>
                </div>
                {/* Content */}
                <motion.div 
                    className="relative z-10 text-center px-4 sm:px-6 lg:px-8"
                    style={{ scale }}
                >
                    <motion.h1 
                        className={`${typography.h1} text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-white`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Elevate Your Style
                    </motion.h1>
                    <motion.p 
                        className={`${typography.body} text-gray-200 mb-8 max-w-2xl mx-auto`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Discover our curated collection of premium clothing and accessories. 
                        Where style meets comfort, and fashion becomes an expression of your unique self.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link 
                            href="/store"
                            className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-105"
                        >
                            <span className="mr-2">Shop Now</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link 
                            href="/collections"
                            className="inline-flex items-center px-8 py-4 bg-transparent text-white border-2 border-white rounded-full hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:scale-105"
                        >
                            <span className="mr-2">View Collections</span>
                            <Heart className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
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

            {/* Features Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className={`${typography.h2} text-gray-900 mb-4`}>Why Choose Us</h2>
                        <p className={`${typography.body} text-gray-500 max-w-2xl mx-auto`}>
                            We're committed to providing you with the best shopping experience, 
                            from our carefully curated collections to our exceptional customer service.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl hover:bg-white/80 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className={`${typography.h4} text-gray-900 mb-2`}>{feature.title}</h3>
                                <p className={`${typography.body} text-gray-500`}>{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className={`${typography.h2} text-gray-900 mb-4`}>What Our Customers Say</h2>
                        <p className={`${typography.body} text-gray-500 max-w-2xl mx-auto`}>
                            Don't just take our word for it - hear from our satisfied customers about their experiences.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl hover:bg-white/80 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 ring-2 ring-purple-500">
                                        <Image
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            width={48}
                                            height={48}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className={`${typography.h4} text-gray-900`}>{testimonial.name}</h3>
                                        <p className={`${typography.body} text-gray-500`}>{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className={`${typography.body} text-gray-600 italic`}>"{testimonial.text}"</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className={`${typography.h2} text-gray-900 mb-4`}>Shop by Category</h2>
                        <p className={`${typography.body} text-gray-500 max-w-2xl mx-auto`}>
                            Explore our diverse collection of premium products across different categories.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {categories.map((category, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
                            >
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className={`${typography.h4} text-white mb-2`}>{category.name}</h3>
                                    <p className={`${typography.body} text-gray-200 mb-4`}>{category.description}</p>
                                    <Link
                                        href={`/store?category=${category.name.toLowerCase()}`}
                                        className="inline-flex items-center text-white hover:text-gray-200 transition-colors duration-300"
                                    >
                                        <span className="mr-2">Explore</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Trending Products Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className={`${typography.h2} text-gray-900 mb-4`}>Trending Now</h2>
                        <p className={`${typography.body} text-gray-500 max-w-2xl mx-auto`}>
                            Discover our most popular products that are making waves this season.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {trendingProducts.map((product, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="group"
                            >
                                <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <h3 className={`${typography.h4} text-gray-900 mb-2`}>{product.name}</h3>
                                <p className={`${typography.body} text-gray-500 mb-2`}>{product.category}</p>
                                <p className={`${typography.h4} text-gray-900`}>${product.price}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* About Us Section - Updated */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div>
                            <h2 className={`${typography.h2} text-gray-900 mb-6`}>Our Story</h2>
                            <p className={`${typography.body} text-gray-600 mb-6`}>
                                Founded in 2020, Stone Store has been at the forefront of fashion innovation. 
                                We believe in sustainable fashion that doesn't compromise on style or quality.
                            </p>
                            <p className={`${typography.body} text-gray-600 mb-8`}>
                                Our commitment to excellence and customer satisfaction has made us one of the 
                                most trusted names in fashion retail.
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl">
                                    <h3 className={`${typography.h4} text-gray-900 mb-2`}>10K+</h3>
                                    <p className={`${typography.body} text-gray-500`}>Happy Customers</p>
                                </div>
                                <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl">
                                    <h3 className={`${typography.h4} text-gray-900 mb-2`}>500+</h3>
                                    <p className={`${typography.body} text-gray-500`}>Products</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative aspect-square rounded-2xl overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070"
                                alt="About Us"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Replace Pricing with Sustainability Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className={`${typography.h2} text-gray-900 mb-4`}>Our Commitment to Sustainability</h2>
                        <p className={`${typography.body} text-gray-500 max-w-2xl mx-auto`}>
                            We're dedicated to making fashion sustainable and ethical
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        <motion.div
                            variants={fadeInUp}
                            className="p-8 bg-white/50 backdrop-blur-sm rounded-2xl hover:bg-white/80 transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                                <Leaf className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className={`${typography.h4} text-gray-900 mb-4`}>Eco-Friendly Materials</h3>
                            <p className={`${typography.body} text-gray-600`}>
                                We use sustainable materials and eco-friendly production processes to minimize our environmental impact.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className="p-8 bg-white/50 backdrop-blur-sm rounded-2xl hover:bg-white/80 transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                                <Recycle className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className={`${typography.h4} text-gray-900 mb-4`}>Recycling Program</h3>
                            <p className={`${typography.body} text-gray-600`}>
                                Our recycling program helps reduce waste and promotes circular fashion.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className="p-8 bg-white/50 backdrop-blur-sm rounded-2xl hover:bg-white/80 transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                                <Heart className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className={`${typography.h4} text-gray-900 mb-4`}>Ethical Production</h3>
                            <p className={`${typography.body} text-gray-600`}>
                                We ensure fair wages and safe working conditions for all our production partners.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className={`${typography.h2} text-gray-900 mb-4`}>Frequently Asked Questions</h2>
                        <p className={`${typography.body} text-gray-500 max-w-2xl mx-auto`}>
                            Find answers to common questions about our products and services
                        </p>
                    </motion.div>

                    <motion.div
                        className="max-w-3xl mx-auto space-y-4"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white/50 backdrop-blur-sm rounded-xl overflow-hidden"
                            >
                                <button
                                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                >
                                    <h3 className={`${typography.h4} text-gray-900`}>{faq.question}</h3>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                                            openFaq === index ? 'transform rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-4">
                                        <p className={`${typography.body} text-gray-600`}>{faq.answer}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
} 