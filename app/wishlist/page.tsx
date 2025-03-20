'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from '@/app/providers/WishlistProvider';
import { useCart } from '@/app/providers/CartProvider';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Your Wishlist is Empty</h1>
        <p className="mt-4 text-gray-600">Add some items to your wishlist to save them for later.</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">My Wishlist</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.productId} className="group relative rounded-lg border p-4">
            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <Link href={`/products/${item.productId}`} className="block">
              <h3 className="text-lg font-medium">{item.product.name}</h3>
              <p className="mt-1 text-lg font-semibold">${item.product.price}</p>
            </Link>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => {
                  addToCart(item.product, 1, item.product.sizes[0], item.product.colors[0]);
                  removeFromWishlist(item.productId);
                }}
                className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={() => removeFromWishlist(item.productId)}
                className="flex items-center justify-center rounded-lg border border-red-500 p-2 text-red-500 hover:bg-red-50"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 