"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Shield, Truck, Clock, ChevronRight } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative h-screen w-full overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero.jpg"
                        alt="Hero background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative flex h-full items-center justify-center px-4">
                    <div className="text-center text-white">
                        <h1 className="animate-fade-up mb-6 text-6xl font-bold tracking-tight md:text-7xl lg:text-8xl">
                            Stone.Store
                        </h1>
                        <p className="animate-fade-up mb-8 text-xl font-light tracking-wide md:text-2xl [animation-delay:200ms]">
                            Discover Timeless Elegance
                        </p>
                        <div className="animate-fade-up [animation-delay:400ms]">
                            <Link
                                href="/store"
                                className="group inline-flex items-center gap-2 rounded-full border-2 border-white bg-transparent px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:bg-white hover:px-10 hover:text-black"
                            >
                                Explore Collection
                                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <h2 className="mb-4 text-center text-3xl font-bold tracking-tight md:text-4xl">
                        Our Collections
                    </h2>
                    <p className="mx-auto mb-16 max-w-2xl text-center text-gray-600">
                        Each piece tells a story of craftsmanship and style
                    </p>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                name: 'Clothing',
                                description: 'Timeless pieces for your wardrobe',
                                image: '/images/clothing.jpg'
                            },
                            {
                                name: 'Accessories',
                                description: 'Details that make the difference',
                                image: '/images/accessories.jpg'
                            },
                            {
                                name: 'Footwear',
                                description: 'Walk with confidence',
                                image: '/images/footwear.jpg'
                            }
                        ].map((category) => (
                            <Link
                                key={category.name}
                                href={`/store?category=${category.name.toLowerCase()}`}
                                className="group relative isolate block overflow-hidden rounded-none border border-gray-200"
                            >
                                <div className="aspect-[4/5] w-full">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                </div>
                                <div className="absolute inset-0 flex flex-col justify-end p-8">
                                    <h3 className="mb-2 text-2xl font-semibold text-white">{category.name}</h3>
                                    <p className="mb-4 text-sm text-gray-200">{category.description}</p>
                                    <div className="flex items-center text-white">
                                        <span className="text-sm font-medium">View Collection</span>
                                        <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="border-t border-gray-200 py-24">
                <div className="container mx-auto px-4">
                    <h2 className="mb-4 text-center text-3xl font-bold tracking-tight md:text-4xl">
                        The Stone.Store Experience
                    </h2>
                    <p className="mx-auto mb-16 max-w-2xl text-center text-gray-600">
                        We believe in quality, style, and exceptional service
                    </p>
                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                icon: ShoppingBag,
                                title: 'Premium Quality',
                                description: 'Carefully selected materials and expert craftsmanship',
                            },
                            {
                                icon: Shield,
                                title: 'Secure Shopping',
                                description: 'Your security is our top priority',
                            },
                            {
                                icon: Truck,
                                title: 'Fast Delivery',
                                description: 'Worldwide shipping options',
                            },
                            {
                                icon: Clock,
                                title: '24/7 Support',
                                description: 'Always here to assist you',
                            },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="group border border-gray-200 p-8 transition-all duration-300 hover:border-black"
                            >
                                <div className="mb-6 inline-block rounded-none border border-current p-4 text-black transition-colors duration-300">
                                    <feature.icon className="h-7 w-7" />
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="border-t border-gray-200 py-24">
                <div className="container mx-auto px-4">
                    <div className="relative px-6 py-16 sm:px-12 sm:py-20">
                        <div className="relative z-10 mx-auto max-w-2xl text-center">
                            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                                Join Our Community
                            </h2>
                            <p className="mb-8 text-lg text-gray-600">
                                Be the first to know about new collections and exclusive offers.
                            </p>
                            <form className="mx-auto flex max-w-md flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 rounded-none border border-gray-200 px-6 py-4 transition-colors duration-300 focus:border-black focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="rounded-none border-2 border-black bg-black px-8 py-4 font-medium text-white transition-colors duration-300 hover:bg-white hover:text-black"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Add custom styles for animations */}
            <style jsx global>{`
                @keyframes fade-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-up {
                    animation: fade-up 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
} 