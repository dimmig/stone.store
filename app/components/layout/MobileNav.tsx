'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Heart, User, Home, Settings, LogOut, Package, Tag, Users, Mail } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/app/providers/CartProvider';
import { useWishlist } from '@/app/providers/WishlistProvider';
import { Logo } from '../ui/logo';

const menuVariants = {
  closed: {
    x: '-100%',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

const backdropVariants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.2
    }
  }
};

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { itemCount: cartItemCount } = useCart();
  const { itemCount: wishlistItemCount } = useWishlist();
  const prevPathname = useRef(pathname);

  // Close menu when pathname changes (only if it's a different path)
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      onClose();
      prevPathname.current = pathname;
    }
  }, [pathname, onClose]);

  const mainNavItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/store', label: 'Store', icon: ShoppingBag },
    { href: '/collections', label: 'Collections', icon: Tag },
    { href: '/about', label: 'About', icon: Users },
    { href: '/contact', label: 'Contact', icon: Mail },
    { 
      href: '/wishlist', 
      label: 'Wishlist', 
      icon: Heart, 
      badge: wishlistItemCount > 0 ? wishlistItemCount : null 
    },
    { 
      href: '/cart', 
      label: 'Cart', 
      icon: ShoppingBag, 
      badge: cartItemCount > 0 ? cartItemCount : null 
    },
  ];

  const accountNavItems = session ? [
    { href: '/dashboard', label: 'Dashboard', icon: Package },
    { href: '/account', label: 'Account Settings', icon: Settings },
    { href: '#', label: 'Sign Out', icon: LogOut, onClick: () => signOut() },
  ] : [
    { href: '/auth/signin', label: 'Sign In', icon: User },
    { href: '/auth/signup', label: 'Create Account', icon: User },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <Logo href="/" className="flex-shrink-0" />
                <button
                  onClick={onClose}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                  {/* Main Navigation */}
                  <div className="space-y-2">
                    {mainNavItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center justify-between px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg group"
                      >
                        <div className="flex items-center">
                          <item.icon className="h-5 w-5 mr-3" />
                          {item.label}
                        </div>
                        {item.badge && (
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full group-hover:bg-blue-200">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Account Navigation */}
                  <div>
                    <h2 className="px-4 text-sm font-semibold text-gray-900 mb-2">Account</h2>
                    <div className="space-y-2">
                      {accountNavItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          onClick={() => {
                            onClose();
                            if (item.onClick) {
                              item.onClick();
                            }
                          }}
                          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                        >
                          <item.icon className="h-5 w-5 mr-3" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 