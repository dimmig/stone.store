import React from 'react';
import type {Metadata, Viewport} from 'next';
import {Inter} from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css';
import {HeaderWrapper} from './components/layout/HeaderWrapper';
import {Providers} from './providers/Providers';
import {ClientProviders} from './providers/ClientProviders';
import {Toaster} from "sonner";
import Footer from './components/layout/Footer';
import { ChatWidget } from '@/components/chat/ChatWidget';

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
                url: 'https://stone-store.app/images/hero.jpg',
                width: 1200,
                height: 630,
                alt: 'STONE.STORE - Premium Shopping Destination',
                type: 'image/jpeg',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'STONE.STORE - Premium Shopping Destination',
        description: 'Discover a curated collection of premium products at STONE.STORE. Shop the latest trends with fast delivery and excellent customer service.',
        images: ['https://stone-store.app/images/hero.jpg'],
        creator: '@stonestore',
    },
    other: {
        'og:site_name': 'STONE.STORE',
        'og:image:width': '1200',
        'og:image:height': '630',
        'og:image:type': 'image/jpeg',
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
                <Analytics />
            </Providers>
        </ClientProviders>
        <ChatWidget />
        <Toaster position="top-center" richColors/>
        </body>
        </html>
    );
} 