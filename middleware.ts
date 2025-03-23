import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  const { pathname } = request.nextUrl;

  // If no token, redirect to sign-in
  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Role-based logic for dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (
      pathname === '/dashboard/settings' ||
      pathname === '/dashboard/orders' ||
      pathname.startsWith('/dashboard/orders/')
    ) {
      return NextResponse.next(); // Allow access
    }

    // Non-admins attempting restricted routes → Redirect to /dashboard/orders
    if (token.role !== 'ADMIN') {
      const ordersUrl = new URL('/dashboard/orders', request.url);
      return NextResponse.redirect(ordersUrl);
    }
  }

  // Default: allow authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/api/cart/:path*',
    '/api/wishlist/:path*',
    '/api/orders/:path*',
    '/api/user/:path*',
    '/api/checkout/:path*',
  ],
}
