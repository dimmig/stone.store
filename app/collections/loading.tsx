'use client';

import React from 'react';

export default function CollectionsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Skeleton */}
      <div className="mb-12 animate-fade-in">
        <div className="relative h-8 w-64 bg-gray-200 rounded-lg overflow-hidden mb-4">
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
        <div className="relative h-4 w-96 bg-gray-200 rounded-lg overflow-hidden">
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
      </div>

      {/* Collections Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3] animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
              <div className="relative h-6 w-32 bg-gray-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </div>
              <div className="relative h-4 w-48 bg-gray-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 