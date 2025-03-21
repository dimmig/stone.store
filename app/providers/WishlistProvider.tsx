"use client";

import React, {createContext, useContext, useState, useEffect} from 'react';
import {WishlistItem, Product} from '@/types';
import {toast} from 'sonner';
import {useSession} from 'next-auth/react';

interface WishlistContextType {
    items: WishlistItem[];
    addToWishlist: (product: Product) => Promise<void>;
    removeFromWishlist: (itemId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    itemCount: number;
    isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({children}: { children: React.ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const {data: session} = useSession();

    // Fetch wishlist items from API on mount and when session changes
    useEffect(() => {
        const fetchWishlistItems = async () => {
            if (!session?.user) {
                setItems([]);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/wishlist');
                if (!response.ok) throw new Error('Failed to fetch wishlist items');
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
                toast.error('Failed to load wishlist items');
            } finally {
                setIsLoading(false);
            }
        };

        fetchWishlistItems();
    }, [session]);

    const addToWishlist = async (product: Product) => {
        if (!session?.user) {
            toast.error('Please sign in to add items to wishlist');
            return;
        }

        try {
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({productId: product.id}),
            });

            if (!response.ok) {
                const error = await response.text();
                if (error === 'Item already in wishlist') {
                    toast.error('Item is already in your wishlist');
                    return;
                }
                throw new Error('Failed to add item to wishlist');
            }

            const newItem = await response.json();
            setItems(current => {
                const exists = current.find(item => item.productId === product.id);
                if (exists) {
                    return current.map(item =>
                        item.productId === product.id ? newItem : item
                    );
                }
                return [...current, newItem];
            });

            toast.success('Added to wishlist');
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            toast.error('Failed to add item to wishlist');
        }
    };

    const removeFromWishlist = async (itemId: string) => {
        if (!session?.user) return;
        try {
            const response = await fetch(`/api/wishlist/${itemId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to remove item from wishlist');

            setItems(current => current.filter(item => item.id !== itemId));
            toast.success('Removed from wishlist');
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('Failed to remove item from wishlist');
        }
    };

    const isInWishlist = (productId: string) => {
        return items.some(item => item.productId === productId);
    };

    const itemCount = items.length;

    const value = {
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        itemCount,
        isLoading,
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
} 