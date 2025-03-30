import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware } from './middleware/auth';

const intlMiddleware = createMiddleware({
  locales: ['en', 'uk'],
  defaultLocale: 'en',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/store': '/store',
    '/collections': '/collections',
    '/about': '/about',
    '/contact': '/contact',
    '/wishlist': '/wishlist',
    '/cart': '/cart',
    '/dashboard': '/dashboard',
    '/dashboard/orders': '/dashboard/orders',
    '/dashboard/settings': '/dashboard/settings',
    '/auth/signin': '/auth/signin',
    '/auth/signup': '/auth/signup',
  },
  localeDetection: true
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle internationalization first
  const response = intlMiddleware(request);
  if (response) return response;

  // Handle authentication for protected routes
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/api/cart') ||
    pathname.startsWith('/api/wishlist') ||
    pathname.startsWith('/api/orders') ||
    pathname.startsWith('/api/user') ||
    pathname.startsWith('/api/checkout')
  ) {
    return authMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - static files
    // - favicon.ico
    '/((?!api|_next|.*\\..*).*)',
  ],
}
