"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import {
  colors,
  typography,
  spacing,
  shadows,
  transitions,
} from "../styles/design-system";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="relative bg-white rounded-lg shadow-sm overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link
        href={`/product/${product.id}`}
        className="block relative aspect-square"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
      </Link>

      {/* Quick Actions */}
      <div
        className={`absolute top-4 right-4 flex flex-col gap-2 transition-transform duration-300 ${
          isHovered ? "translate-x-0" : "translate-x-16"
        }`}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-900 hover:text-white transition-colors duration-300"
          onClick={() => {
            // Add to cart functionality
            console.log("Add to cart:", product.id);
          }}
        >
          <ShoppingCart className="h-5 w-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-900 hover:text-white transition-colors duration-300"
          onClick={() => {
            // Add to wishlist functionality
            console.log("Add to wishlist:", product.id);
          }}
        >
          <Heart className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3
            className={`${typography.h4} text-gray-900 mb-1 group-hover:text-accent-gold transition-colors duration-300`}
          >
            {product.name}
          </h3>
        </Link>
        <p className={`${typography.body} text-gray-500 mb-2 line-clamp-2`}>
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className={`${typography.h4} text-accent-gold`}>
            ${product.price.toLocaleString()}
          </span>
          <span className={`${typography.body} text-gray-500`}>
            {product.category?.name || "Uncategorized"}
          </span>
        </div>
      </div>

      {/* Quick View Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
        className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t"
      >
        <Link
          href={`/product/${product.id}`}
          className="block w-full text-center py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-300"
        >
          Quick View
        </Link>
      </motion.div>
    </motion.div>
  );
}
