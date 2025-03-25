'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
  currentIndex?: number;
  onImageChange?: (index: number) => void;
}

export function ImageCarousel({
  images,
  aspectRatio = 'square',
  className = '',
  showArrows = true,
  showDots = true,
  currentIndex,
  onImageChange
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex || 0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (currentIndex !== undefined && currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
    }
  }, [currentIndex]);

  const goToImage = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(index);
    onImageChange?.(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const nextImage = () => {
    if (isAnimating) return;
    const nextIndex = (activeIndex + 1) % images.length;
    goToImage(nextIndex);
  };

  const previousImage = () => {
    if (isAnimating) return;
    const prevIndex = (activeIndex - 1 + images.length) % images.length;
    goToImage(prevIndex);
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]'
  };

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl ${aspectRatioClasses[aspectRatio]} ${className}`}
    >
      <div className="relative h-full w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex]}
              alt={`Image ${activeIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={previousImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-900 opacity-0 shadow-md transition-all hover:bg-white hover:shadow-lg group-hover:opacity-100 md:opacity-100"
            disabled={isAnimating}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-900 opacity-0 shadow-md transition-all hover:bg-white hover:shadow-lg group-hover:opacity-100 md:opacity-100"
            disabled={isAnimating}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/20 px-3 py-1.5 backdrop-blur-sm">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              disabled={isAnimating}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex
                  ? 'w-4 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 