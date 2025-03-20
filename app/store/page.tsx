'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Search, Filter, X, Star, Pin, PinOff, Check } from 'lucide-react';
import { useCart } from '@/app/providers/CartProvider';
import { useWishlist } from '@/app/providers/WishlistProvider';
import { Product } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

async function getProducts(searchQuery = '', filters = {}) {
  const params = new URLSearchParams({
    search: searchQuery,
    ...filters
  });
  const response = await fetch(`/api/products?${params}`);
  const data = await response.json();
  return data;
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    sortBy: 'newest',
    inStock: false,
    color: '',
    size: '',
    rating: ''
  });

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await getProducts(searchQuery, filters);
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addToCart(product, 1, product.sizes[0], product.colors[0]);
  };

  const handleToggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const categories = [
    { label: 'All Categories', value: '' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Footwear', value: 'footwear' }
  ];

  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: 'Under $50', value: '0-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100 - $200', value: '100-200' },
    { label: 'Over $200', value: '200-' }
  ];

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Best Rating', value: 'rating-desc' }
  ];

  const colorOptions = [
    { label: 'Black', value: 'black', class: 'bg-black' },
    { label: 'White', value: 'white', class: 'bg-white border border-gray-200' },
    { label: 'Red', value: 'red', class: 'bg-red-500' },
    { label: 'Blue', value: 'blue', class: 'bg-blue-500' },
    { label: 'Green', value: 'green', class: 'bg-green-500' }
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const ratingOptions = ['4 & up', '3 & up', '2 & up', '1 & up'];

  const FilterContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
          <p className="mt-1 text-sm text-gray-500">Refine your search</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPinned(!isPinned)}
            className="group rounded-full p-2 hover:bg-gray-100"
            title={isPinned ? "Unpin filters" : "Pin filters"}
          >
            {isPinned ? (
              <PinOff className="h-5 w-5 text-gray-400 transition-colors group-hover:text-gray-600" />
            ) : (
              <Pin className="h-5 w-5 text-gray-400 transition-colors group-hover:text-gray-600" />
            )}
          </button>
          {!isPinned && (
            <button
              onClick={() => setShowFilters(false)}
              className="group rounded-full p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-400 transition-colors group-hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-xl bg-gray-50/50 p-4">
        <h3 className="mb-4 text-sm font-medium text-gray-900">Categories</h3>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setFilters({ ...filters, category: category.value })}
              className={`flex items-center justify-center rounded-lg px-3 py-2 text-sm transition-all ${
                filters.category === category.value
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="rounded-xl bg-gray-50/50 p-4">
        <h3 className="mb-4 text-sm font-medium text-gray-900">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
          {priceRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setFilters({ ...filters, priceRange: range.value })}
              className={`flex items-center justify-center rounded-lg px-3 py-2 text-sm transition-all ${
                filters.priceRange === range.value
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="rounded-xl bg-gray-50/50 p-4">
        <h3 className="mb-4 text-sm font-medium text-gray-900">Colors</h3>
        <div className="flex flex-wrap gap-3">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              onClick={() => setFilters({ ...filters, color: color.value })}
              className={`group relative h-10 w-10 overflow-hidden rounded-xl ${color.class} ${
                filters.color === color.value ? 'ring-2 ring-black ring-offset-2' : ''
              } transition-all hover:scale-110`}
              title={color.label}
            >
              {filters.color === color.value && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <Check className="h-5 w-5 text-white drop-shadow" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="rounded-xl bg-gray-50/50 p-4">
        <h3 className="mb-4 text-sm font-medium text-gray-900">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size) => (
            <button
              key={size}
              onClick={() => setFilters({ ...filters, size })}
              className={`relative h-10 w-10 rounded-lg text-sm transition-all hover:scale-105 ${
                filters.size === size
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="rounded-xl bg-gray-50/50 p-4">
        <h3 className="mb-4 text-sm font-medium text-gray-900">Rating</h3>
        <div className="space-y-2">
          {ratingOptions.map((rating) => (
            <button
              key={rating}
              onClick={() => setFilters({ ...filters, rating })}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
                filters.rating === rating
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {rating.split(' ')[0]}
                <Star className={`h-4 w-4 fill-current ${filters.rating === rating ? 'text-white' : 'text-yellow-400'}`} />
                & up
              </span>
              <span className="text-xs opacity-60">({Math.floor(Math.random() * 100) + 50})</span>
            </button>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div className="rounded-xl bg-gray-50/50 p-4">
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-sm font-medium text-gray-900">In Stock Only</span>
          <div
            className={`relative h-6 w-11 rounded-full transition-colors ${
              filters.inStock ? 'bg-black' : 'bg-gray-200'
            }`}
          >
            <div
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                filters.inStock ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
            <input
              type="checkbox"
              className="sr-only"
              checked={filters.inStock}
              onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
            />
          </div>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilters({
            category: '',
            priceRange: '',
            sortBy: 'newest',
            inStock: false,
            color: '',
            size: '',
            rating: ''
          })}
          className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Clear All
        </button>
        <button
          onClick={() => setShowFilters(false)}
          className="flex-1 rounded-xl bg-black py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Search and Filters Header */}
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border-0 bg-gray-100 px-4 py-2.5 pl-10 text-sm ring-0 placeholder:text-gray-500 focus:border-0 focus:outline-none focus:ring-2 focus:ring-black/5"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {!isPinned && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200"
                >
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-6">
          {/* Pinned Filters Sidebar */}
          {isPinned && (
            <div className="w-64 shrink-0">
              <div className="sticky top-20 rounded-xl border border-gray-200/50 bg-white p-5 shadow-sm">
                <FilterContent />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading ? (
                // Loading skeletons
                [...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl bg-white p-5 shadow-sm">
                    <div className="aspect-[4/5] rounded-xl bg-gray-100" />
                    <div className="mt-5 space-y-3">
                      <div className="h-4 w-2/3 rounded-full bg-gray-100" />
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-1/4 rounded-full bg-gray-100" />
                        <div className="h-4 w-1/4 rounded-full bg-gray-100" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Product grid
                products?.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/50"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-50">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="h-full w-full object-cover object-center transition-transform duration-500 will-change-transform group-hover:scale-105"
                      />
                      <div className="absolute right-3 top-3 flex gap-2">
                        <button
                          onClick={(e) => handleToggleWishlist(e, product)}
                          className={`rounded-xl bg-white/90 p-2.5 backdrop-blur-sm transition-all hover:scale-110 ${
                            isInWishlist(product.id) 
                              ? 'text-red-500 hover:bg-red-50' 
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Heart className={`h-[18px] w-[18px] ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="rounded-xl bg-white/90 p-2.5 text-gray-600 backdrop-blur-sm transition-all hover:scale-110 hover:bg-gray-50 hover:text-gray-900"
                        >
                          <ShoppingBag className="h-[18px] w-[18px]" />
                        </button>
                      </div>
                      {product.discount > 0 && (
                        <div className="absolute left-3 top-3">
                          <div className="rounded-lg bg-black px-2 py-1 text-xs font-medium text-white">
                            -{product.discount}%
                          </div>
                        </div>
                      )}
                      {product.isNew && (
                        <div className="absolute left-3 top-3">
                          <div className="rounded-lg bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                            New
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="flex-1 text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          <span className="text-xs font-medium text-gray-600">
                            {product.rating || '4.5'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            ${product.price}
                          </span>
                          {product.discount > 0 && (
                            <span className="text-xs text-gray-500 line-through">
                              ${Math.round(product.price * (1 + product.discount / 100))}
                            </span>
                          )}
                        </div>
                        {product.inStock ? (
                          <span className="text-xs font-medium text-green-600">In Stock</span>
                        ) : (
                          <span className="text-xs font-medium text-red-500">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
      <AnimatePresence>
        {showFilters && !isPinned && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 z-40 bg-black"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white p-6 shadow-lg"
            >
              <FilterContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 