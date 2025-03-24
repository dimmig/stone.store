'use client';

import React from 'react';
import Link from 'next/link';
import {ShoppingCart, Heart} from 'lucide-react';
import {useSession} from 'next-auth/react';
import {SignInButton} from '../auth/SignInButton';
import {UserAccountNav} from '../auth/UserAccountNav';
import {useCart} from '@/app/providers/CartProvider';
import {useWishlist} from '@/app/providers/WishlistProvider';
import {Logo} from '../ui/logo';
import LanguageSelector from '@/components/LanguageSelector';

const navigationLinks = [
    { href: '/store', text: 'Store' },
    { href: '/collections', text: 'Collections' },
];

export function Header() {
    const {data: session} = useSession();
    const {itemCount: cartItemCount} = useCart();
    const {itemCount: wishlistItemCount} = useWishlist();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Logo href='/' className="flex-shrink-0"/>

                {/* Navigation */}
                <nav className="flex items-center space-x-6">
                    {navigationLinks.map((link) => (
                        <Link 
                            key={link.href}
                            href={link.href} 
                            className="hidden lg:block text-gray-600 hover:text-gray-900"
                        >
                            {link.text}
                        </Link>
                    ))}
                    
                    <Link href={session?.user ? "/wishlist" : "/auth/signin"} className="relative hidden lg:block">
                        <Heart className="h-6 w-6"/>
                        {wishlistItemCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                                {wishlistItemCount}
                            </span>
                        )}
                    </Link>

                    <Link href={session?.user ? "/cart" : "/auth/signin"} className="relative">
                        <ShoppingCart className="h-6 w-6"/>
                        {cartItemCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                                {cartItemCount}
                            </span>
                        )}
                    </Link>

                    <LanguageSelector />

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