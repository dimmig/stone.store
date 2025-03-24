"use client";

import { useCart } from "@/app/providers/CartProvider";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.2 }
  }
};

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, checkout, isLoading } = useCart();
  const router = useRouter();

  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      toast.error('Not enough stock available');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col items-center justify-center min-h-[60vh] px-4"
      >
        <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some items to your cart to get started</p>
        <Link
          href="/store"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </motion.div>
    );
  }

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shipping = 10; 
  const total = subtotal + shipping;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={`${item.product.id}-${item.size}-${item.color}`}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="bg-white rounded-lg shadow-sm p-6 mb-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 rounded-md overflow-hidden">
                    <Image
                      src={item.product.imageUrls[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      {item.size && <span className="mr-4">Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => handleQuantityUpdate(item.id, Math.max(1, item.quantity - 1))}
                          className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                          disabled={item.quantity >= item.product.stockQuantity}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {item.product.stockQuantity} available in stock
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      ${item.product.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8"
        >
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-2 border-t">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={checkout}
            className="w-full bg-black text-white px-6 py-3 rounded-lg font-medium
              hover:opacity-80 transition-colors flex items-center justify-center gap-2"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={() => router.push("/store")}
            className="w-full mt-4 text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
} 