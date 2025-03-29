import React from 'react';
import {CartProvider} from './CartProvider';
import {WishlistProvider} from './WishlistProvider';
import {UserProvider} from "@/app/providers/UserProvider";

export function Providers({children}: { children: React.ReactNode }) {
    return (
            <UserProvider>
                <CartProvider>
                    <WishlistProvider>{children}</WishlistProvider>
                </CartProvider>
            </UserProvider>
    );
} 