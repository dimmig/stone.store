'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, User, Menu } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { SignInButton } from '../auth/SignInButton';
import { UserAccountNav } from '../auth/UserAccountNav';
import { useCart } from '@/app/providers/CartProvider';
import { useWishlist } from '@/app/providers/WishlistProvider';
import { Logo } from '../ui/logo';

interface HeaderProps {
    isMobileMenuOpen: boolean;
    onMobileMenuOpen: (isOpen: boolean) => void;
}

export function Header({ isMobileMenuOpen, onMobileMenuOpen }: HeaderProps) {
    const { data: session } = useSession();
    const { itemCount: cartItemCount } = useCart();
    const { itemCount: wishlistItemCount } = useWishlist();

    const handleMenuClick = () => {
        console.log('Menu button clicked, current state:', isMobileMenuOpen);
        onMobileMenuOpen(true);
        console.log('Menu state after click:', isMobileMenuOpen);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={handleMenuClick}
                    className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {/* Logo */}
                <Logo href='/' className="flex-shrink-0"/>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    <Link href="/store" className="text-gray-600 hover:text-gray-900">
                        Store
                    </Link>
                    <Link href="/collections" className="text-gray-600 hover:text-gray-900">
                        Collections
                    </Link>
                    <Link href="/wishlist" className="text-gray-600 hover:text-gray-900 relative">
                        <Heart className="h-5 w-5" />
                        {wishlistItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {wishlistItemCount}
                            </span>
                        )}
                    </Link>
                    <Link href="/cart" className="text-gray-600 hover:text-gray-900 relative">
                        <ShoppingCart className="h-5 w-5" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </Link>
                    {session ? (
                        <UserAccountNav />
                    ) : (
                        <SignInButton />
                    )}
                </nav>
            </div>
        </header>
    );
} 