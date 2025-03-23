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
    metadataBase: new URL('https://stone-store.app'),
    title: 'STONE.STORE - Premium Shopping Destination | Luxury Products & Fashion',
    description: 'STONE.STORE - Your premium shopping destination for luxury products, fashion, and lifestyle items. Discover curated collections with fast delivery and exceptional service.',
    keywords: 'stone store, premium shopping, luxury products, fashion, lifestyle, home goods, accessories, online store, premium brands',
    authors: [{ name: 'STONE.STORE Team' }],
    creator: 'STONE.STORE',
    publisher: 'STONE.STORE',
    alternates: {
        canonical: 'https://stone-store.app',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://stone-store.app',
        siteName: 'STONE.STORE',
        title: 'STONE.STORE - Premium Shopping Destination',
        description: 'Discover a curated collection of premium products at STONE.STORE. Shop the latest trends with fast delivery and excellent customer service.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'STONE.STORE - Premium Shopping Destination',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'STONE.STORE - Premium Shopping Destination',
        description: 'Discover a curated collection of premium products at STONE.STORE. Shop the latest trends with fast delivery and excellent customer service.',
        images: ['/og-image.jpg'],
        creator: '@stonestore',
    },
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
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-site-verification',
        yandex: 'your-yandex-verification',
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