import React from 'react';
import type {Metadata, Viewport} from 'next';
import {Inter} from 'next/font/google';
import '../styles/globals.css';
import {HeaderWrapper} from './components/layout/HeaderWrapper';
import {Providers} from './providers/Providers';
import {ClientProviders} from './providers/ClientProviders';
import {Toaster} from "sonner";
import Footer from './components/layout/Footer';

const inter = Inter({subsets: ['latin']});

export const viewport: Viewport = {
    themeColor: '#ffffff',
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    title: 'STONE.STORE',
    description: 'Your one-stop shop for all your needs',
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/favicon.ico', sizes: 'any' }
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
        ]
    },
    manifest: '/site.webmanifest',
    robots: 'index, follow',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://stone.store',
        siteName: 'STONE.STORE',
        title: 'STONE.STORE',
        description: 'Your one-stop shop for all your needs',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'STONE.STORE',
        description: 'Your one-stop shop for all your needs',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ClientProviders>
            <Providers>
                <HeaderWrapper />
                <main className="min-h-screen">
                    {children}
                </main>
                <Footer/>
            </Providers>
        </ClientProviders>
        <Toaster position="top-center" richColors/>
        </body>
        </html>
    );
} 