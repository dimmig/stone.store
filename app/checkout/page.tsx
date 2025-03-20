'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/providers/CartProvider';
import CheckoutForm from '@/app/components/CheckoutForm';

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50">
      <div className="mx-auto max-w-7xl">
        <div className="border-b bg-white px-4 py-8">
          <h1 className="text-center text-2xl font-bold">Checkout</h1>
        </div>
        <CheckoutForm />
      </div>
    </div>
  );
} 