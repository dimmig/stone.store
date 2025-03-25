'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
  onImageChange?: (index: number) => void;
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export function ImageCarousel({
  images,
  aspectRatio = 'square',
  className = '',
  showArrows = true,
  showDots = true,
  onImageChange
}: ImageCarouselProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isDragging, setIsDragging] = useState(false);

  const imageIndex = Math.abs(page % images.length);

  const paginate = (newDirection: number) => {
    const newPage = page + newDirection;
    setPage([newPage, newDirection]);
    onImageChange?.(Math.abs(newPage % images.length));
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]'
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl ${aspectRatioClasses[aspectRatio]} ${className}`}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(e, { offset, velocity }) => {
            setIsDragging(false);
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={images[imageIndex]}
            alt={`Image ${imageIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={imageIndex === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-900 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            onClick={() => !isDragging && paginate(-1)}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-900 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            onClick={() => !isDragging && paginate(1)}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === imageIndex
                  ? 'bg-white w-4'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => {
                const direction = index - imageIndex;
                setPage([index, direction]);
                onImageChange?.(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
} 