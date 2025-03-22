'use client';

import React from 'react';
import Link from 'next/link';
import {Search, ShoppingCart, Heart, User} from 'lucide-react';
import {useSession} from 'next-auth/react';
import {SignInButton} from '../auth/SignInButton';
import {UserAccountNav} from '../auth/UserAccountNav';
import {useCart} from '@/app/providers/CartProvider';
import {useWishlist} from '@/app/providers/WishlistProvider';
import {Logo} from '../ui/logo';

export function Header() {
    const {data: session} = useSession();
    const {itemCount: cartItemCount} = useCart();
    const {itemCount: wishlistItemCount} = useWishlist();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Logo className="flex-shrink-0"/>

                {/* Search Bar */}
                <div className="hidden flex-1 items-center justify-center px-20 lg:flex">
                    <div className="relative w-full max-w-2xl">
                        <input
                            type="search"
                            placeholder="Search products..."
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex items-center space-x-6">
                    <Link href={session?.user ? "/wishlist" : "/auth/signin"} className="relative hidden lg:block">
                        <Heart className="h-6 w-6"/>
                        {wishlistItemCount > 0 && (
                            <span
                                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                {wishlistItemCount}
              </span>
                        )}
                    </Link>

                    <Link href={session?.user ? "/cart" : "/auth/signin"} className="relative">
                        <ShoppingCart className="h-6 w-6"/>
                        {cartItemCount > 0 && (
                            <span
                                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                {cartItemCount}
              </span>
                        )}
                    </Link>

                    {session ? (
                        <UserAccountNav/>
                    ) : (
                        <SignInButton/>
                    )}
                </nav>
            </div>
        </header>
    );
} 