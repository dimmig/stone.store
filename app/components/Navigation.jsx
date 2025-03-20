'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, typography, spacing, shadows, transitions } from '../styles/design-system';

export default function Navigation() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`text-2xl font-serif font-bold ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}
              >
                Stone.Store
              </motion.span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <NavLink href="/store" scrolled={scrolled}>
                Shop
              </NavLink>
              <NavLink href="/collections" scrolled={scrolled}>
                Collections
              </NavLink>
              <NavLink href="/about" scrolled={scrolled}>
                About
              </NavLink>
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-full ${
                scrolled ? 'text-gray-500 hover:text-gray-900' : 'text-white hover:text-gray-200'
              }`}
            >
              <Search className="h-5 w-5" />
            </motion.button>
            <Link href="/cart">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full relative ${
                  scrolled ? 'text-gray-500 hover:text-gray-900' : 'text-white hover:text-gray-200'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {session && (
                  <span className="absolute -top-1 -right-1 bg-accent-gold text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    0
                  </span>
                )}
              </motion.div>
            </Link>

            {session ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-4"
              >
                <span className={`${scrolled ? 'text-gray-700' : 'text-white'}`}>
                  {session.user.name}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut()}
                  className={`text-sm ${
                    scrolled ? 'text-gray-500 hover:text-gray-900' : 'text-white hover:text-gray-200'
                  }`}
                >
                  Sign out
                </motion.button>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink href="/auth/signin" scrolled={scrolled}>
                  Sign in
                </NavLink>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full border ${
                    scrolled
                      ? 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                      : 'border-white text-white hover:bg-white hover:text-gray-900'
                  }`}
                >
                  <Link href="/auth/signup">Sign up</Link>
                </motion.div>
              </div>
            )}
          </div>

          <div className="sm:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md ${
                scrolled ? 'text-gray-500' : 'text-white'
              }`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden bg-white"
          >
            <div className="pt-2 pb-3 space-y-1">
              <MobileNavLink href="/store">Shop</MobileNavLink>
              <MobileNavLink href="/collections">Collections</MobileNavLink>
              <MobileNavLink href="/about">About</MobileNavLink>
              {session ? (
                <>
                  <div className="px-3 py-2 text-base font-medium text-gray-700">
                    {session.user.name}
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink href="/auth/signin">Sign in</MobileNavLink>
                  <MobileNavLink href="/auth/signup">Sign up</MobileNavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function NavLink({ href, children, scrolled }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href={href}
        className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
          scrolled
            ? 'text-gray-500 hover:text-gray-900'
            : 'text-white hover:text-gray-200'
        }`}
      >
        {children}
      </Link>
    </motion.div>
  );
}

function MobileNavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
    >
      {children}
    </Link>
  );
} 