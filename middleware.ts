import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'

// Export the withAuth middleware with your config
export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: '/auth/signin',
  },
})

// Middleware function for CORS and other modifications
export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next()

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')

  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Protected API routes (require authentication)
    '/api/cart/:path*',
    '/api/wishlist/:path*',
    '/api/orders/:path*',
    '/api/user/:path*',
    '/api/checkout/:path*',
    // Public API routes (no authentication required)
    // '/api/products/:path*',
    // '/api/categories/:path*',
    // '/api/filters/:path*',
    // Protected dashboard routes
    '/dashboard/:path*',
  ],
}
