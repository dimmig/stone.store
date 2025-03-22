'use client';

import {useWishlist} from "@/app/providers/WishlistProvider";
import {useCart} from "@/app/providers/CartProvider";
import {WishlistItem} from "@/types";
import {motion, AnimatePresence} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {Loader2, Heart, ShoppingCart, ShoppingBag, Trash2} from "lucide-react";
import {useRouter} from "next/navigation";

const containerVariants = {
    hidden: {opacity: 0, y: 20},
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.2,
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: {opacity: 0, x: -20},
    visible: {
        opacity: 1,
        x: 0,
        transition: {duration: 0.3}
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: {duration: 0.2}
    }
};

export default function WishlistPage() {
    const {items, removeFromWishlist, isLoading} = useWishlist();
    const {addToCart} = useCart();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin"/>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex flex-col items-center justify-center min-h-[60vh] px-4"
            >
                <Heart className="w-16 h-16 text-gray-400 mb-4"/>
                <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
                <p className="text-gray-600 mb-8">Save items you love to your wishlist</p>
                <Link
                    href="/store"
                    className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-80 transition-colors"
                >
                    Continue Shopping
                </Link>
            </motion.div>
        );
    }

    const handleAddToCart = async (item: WishlistItem) => {
        await router.push(`/products/${item.product.id}`);
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="container mx-auto px-4 py-8"
        >
            <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            className="bg-white rounded-lg shadow-sm overflow-hidden group"
                        >
                            <div className="relative aspect-square">
                                <Image
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                    {item?.product?.stockQuantity > 0 && (
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="p-2 bg-white rounded-full hover:scale-110 transition-transform"
                                            title="Add to cart"
                                        >
                                            <ShoppingCart className="w-5 h-5"/>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="p-2 bg-white rounded-full hover:scale-110 transition-transform text-red-500"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium truncate">{item.product.name}</h3>
                                <div className="flex items-center justify-between mt-2">
                                    <p className="font-medium">${item.product.price.toFixed(2)}</p>
                                    <span
                                        className={`text-sm ${item.product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {item.product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {items.length > 0 && (
                <motion.div
                    variants={itemVariants}
                    className="mt-8 text-center"
                >
                    <button
                        onClick={() => router.push("/store")}
                        className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
                    >
                        Continue Shopping
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
} 