'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { useCart } from '@/app/providers/CartProvider';
import Link from 'next/link';

export default function CartPage() {
  const { t, locale } = useTranslation();
  const { items, removeItem, updateQuantity } = useCart();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getLocalizedHref = (path: string) => `/${locale}/${path}`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {t('cart.title')}
      </h1>

      {items.length === 0 ? (
        <p className="mt-6 text-lg text-gray-500">
          {t('cart.empty')}
        </p>
      ) : (
        <div className="mt-8">
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${item.price.toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center">
                        <label htmlFor={`quantity-${item.id}`} className="mr-2">
                          {t('products.quantity')}:
                        </label>
                        <select
                          id={`quantity-${item.id}`}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="rounded-md border-gray-300 py-1.5 text-base leading-5 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        {t('common.remove')}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>{t('cart.total')}</p>
              <p>${total.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              {t('cart.shippingNote')}
            </p>

            <div className="mt-6">
              <Link
                href={getLocalizedHref('checkout')}
                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                {t('cart.checkout')}
              </Link>
            </div>

            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                <span>{t('cart.or')}</span>
                {' '}
                <Link
                  href={getLocalizedHref('store')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {t('cart.continueShopping')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 