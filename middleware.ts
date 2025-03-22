import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAdminRoute = ['/dashboard', '/dashboard/customers', '/dashboard/products'].some(route => req.nextUrl.pathname.startsWith(route));
        const settingsRoute = ['/dashboard/settings'];

        if (isAdminRoute && token?.role !== 'ADMIN' && !settingsRoute.includes(req.nextUrl.pathname)) {
            if (req.nextUrl.pathname !== '/dashboard/orders') {
                return NextResponse.redirect(new URL('/dashboard/orders', req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ['/dashboard/:path*'],
};
