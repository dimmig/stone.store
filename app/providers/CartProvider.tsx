"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { getStripe } from '@/lib/stripe';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {useUserStore} from "@/store/user-store";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
  itemCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const { user } = useUserStore()

  // Fetch cart items from API on mount and when session changes
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!session?.user) {
        setItems([]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Failed to fetch cart items');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load cart items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [session]);

  const addToCart = async (product: Product, quantity: number, size?: string, color?: string) => {
    if (!session?.user) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          size,
          color,
        }),
      });

      if (!response.ok) throw new Error('Failed to add item to cart');

      const newItem = await response.json();
      setItems(current => {
        const exists = current.find(item =>
            item.id === newItem.id &&
            item.size === size &&
            item.color === color
        );

        if (exists) {
          return current.map(item =>
              item.id === newItem.id ? newItem : item
          );
        }

        return [...current, newItem];
      });

      toast.success('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!session?.user) return;

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove item from cart');

      setItems(current => current.filter(item => item.id !== itemId));
      toast.success('Removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!session?.user) return;

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) throw new Error('Failed to update quantity');

      const updatedItem = await response.json();
      setItems(current =>
          current.map(item => (item.id === itemId ? updatedItem : item))
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      await Promise.all(items.map(item =>
        fetch(`/api/cart/${item.id}`, {
          method: 'DELETE',
        }).then(res => {
          console.log("RESULT")
          if (!res.ok) throw new Error('Failed to remove item from cart');
        }).catch(e => console.log(e))
      ));
      setItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const checkout = async () => {
    if (!session?.user) {
      toast.error('Please sign in to checkout');
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cartItems: items,
          userId: user?.id
        }),
      });

      if (!response.ok) throw new Error('Failed to initiate checkout');

      const data = await response.json();
      if (!data.sessionId) throw new Error('No checkout session ID received');

      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Failed to initiate checkout');
    }
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    itemCount,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 