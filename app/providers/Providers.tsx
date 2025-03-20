import React from 'react';
import { CartProvider } from './CartProvider';
import { WishlistProvider } from './WishlistProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartProvider>
  );
} 