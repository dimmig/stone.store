'use client';

import {useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {motion, AnimatePresence} from 'framer-motion';
import {
    User,
    ShoppingBag,
    Settings,
    ChevronDown,
    LogOut,
    Package,
    Users,
    BarChart,
    Menu,
    X,
    Home,
} from 'lucide-react';
import {typography} from '../styles/design-system';
import {signOut, useSession} from "next-auth/react";
import {useUserStore} from "@/store/user-store";
import {Role} from "@prisma/client";

const adminNavigation = [
    {name: 'Overview', href: '/dashboard', icon: BarChart},
    {name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag},
    {name: 'Products', href: '/dashboard/products', icon: Package},
    {name: 'Customers', href: '/dashboard/customers', icon: Users},
    {name: 'Settings', href: '/dashboard/settings', icon: Settings},
];

const userNavigation = [
    {name: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag},
    {name: 'Settings', href: '/dashboard/settings', icon: Settings},
];

export default function DashboardLayout({children}) {
    const pathname = usePathname();
    const {data: session} = useSession();
    const user = useUserStore((state) => state.user);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const isAdmin = user?.role === Role.ADMIN;

    const navigation = isAdmin ? adminNavigation : userNavigation;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo and Mobile Menu Button */}
                        <div className="flex items-center gap-2">
                            <div className="flex-shrink-0">
                                <Link href="/dashboard" className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-lg bg-accent-gold flex items-center justify-center">
                                        <ShoppingBag className="h-5 w-5 text-white"/>
                                    </div>
                                    <span className={`${typography.h4} text-gray-900`}>Dashboard</span>
                                </Link>
                            </div>

                            {/* Mobile menu button */}
                            <div className="ml-4 md:hidden">
                                <motion.button
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                >
                                    {isMobileMenuOpen ? (
                                        <X className="h-6 w-6"/>
                                    ) : (
                                        <Menu className="h-6 w-6"/>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? 'bg-accent-gold/10 text-accent-gold'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5"/>
                                        <span className={`${typography.body} font-medium`}>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Profile and Store Link */}
                        <div className="flex items-center gap-2">
                            <Link
                                href="/"
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                            >
                                <Home className="h-5 w-5"/>
                                <span className={`${typography.body} font-medium`}>Store</span>
                            </Link>

                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <User className="h-5 w-5 text-gray-600"/>
                                    </div>
                                    <div className="hidden md:block text-right">
                                        <p className={`${typography.body} font-medium text-gray-900`}>
                                            {user?.name || 'User'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {isAdmin ? 'Administrator' : 'Customer'}
                                        </p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-400"/>
                                </button>

                                <AnimatePresence>
                                    {isProfileMenuOpen && (
                                        <motion.div
                                            initial={{opacity: 0, y: 8}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0, y: 8}}
                                            className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-gray-100 py-1"
                                        >
                                            <button
                                                onClick={() => signOut()}
                                                className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50 flex items-center space-x-2"
                                            >
                                                <LogOut className="h-4 w-4"/>
                                                <span>Sign out</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.nav
                            initial={{opacity: 0, height: 0}}
                            animate={{opacity: 1, height: 'auto'}}
                            exit={{opacity: 0, height: 0}}
                            className="md:hidden border-t border-gray-100"
                        >
                            <div className="px-4 py-3 space-y-1">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-accent-gold/10 text-accent-gold'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                        >
                                            <item.icon className="h-5 w-5"/>
                                            <span className={`${typography.body} font-medium`}>{item.name}</span>
                                        </Link>
                                    );
                                })}

                                {/* Store Link in Mobile Menu */}
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                                >
                                    <Home className="h-5 w-5"/>
                                    <span className={`${typography.body} font-medium`}>Back to Store</span>
                                </Link>
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-8">
                {children}
            </main>
        </div>
    );
} 