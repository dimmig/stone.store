'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { colors, typography, spacing, shadows, transitions } from '../../styles/design-system';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Diamond Solitaire Ring',
      price: 199.99,
      image: '/images/products/ring-1.jpg',
      category: 'Rings',
    },
    {
      id: 2,
      name: 'Gold Chain Necklace',
      price: 100.00,
      image: '/images/products/necklace-1.jpg',
      category: 'Necklaces',
    },
    // Add more items as needed
  ]);

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  const addToCart = (item) => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', item);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className={`${typography.h2} text-gray-900`}>My Wishlist</h1>
        <p className={`${typography.body} text-gray-500`}>
          {wishlistItems.length} items
        </p>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden group"
          >
            {/* Image */}
            <div className="relative aspect-square">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`${typography.h4} text-gray-900 mb-1`}>
                    {item.name}
                  </h3>
                  <p className={`${typography.body} text-gray-500`}>
                    {item.category}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFromWishlist(item.id)}
                  className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors duration-300"
                >
                  <Trash2 className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="flex justify-between items-center">
                <p className={`${typography.h5} text-gray-900`}>
                  ${item.price.toFixed(2)}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(item)}
                  className="flex items-center space-x-2 px-4 py-2 bg-accent-gold text-white rounded-full hover:bg-accent-gold-dark transition-colors duration-300"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {wishlistItems.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block p-4 rounded-full bg-accent-gold/10 mb-4">
            <Heart className="h-8 w-8 text-accent-gold" />
          </div>
          <h3 className={`${typography.h4} text-gray-900 mb-2`}>
            Your wishlist is empty
          </h3>
          <p className={`${typography.body} text-gray-500 mb-4`}>
            Save items you love to your wishlist. Review them anytime and easily move them to the cart.
          </p>
          <Link href="/store">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-accent-gold text-white rounded-full hover:bg-accent-gold-dark transition-colors duration-300"
            >
              Start Shopping
            </motion.button>
          </Link>
        </div>
      )}
    </div>
  );
} 