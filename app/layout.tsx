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
    themeColor: '#1A1A1A',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata: Metadata = {
    metadataBase: new URL('https://stone-store.app'),
    title: {
        default: 'STONE.STORE - Premium Fashion & Lifestyle | Gray Clothes Varieties',
        template: '%s | STONE.STORE'
    },
    description: 'Discover premium gray clothes varieties at STONE.STORE. We offer high-quality fashion, sustainable clothing, and exceptional customer service. Because you deserve the best!',
    keywords: [
        'stone store',
        'gray clothes',
        'premium fashion',
        'sustainable clothing',
        'luxury fashion',
        'designer clothes',
        'gray varieties',
        'premium shopping',
        'fashion store',
        'sustainable fashion',
        'ethical clothing',
        'luxury lifestyle',
        'premium brands',
        'quality clothes',
        'fashion boutique'
    ],
    authors: [{ name: 'STONE.STORE Team' }],
    creator: 'STONE.STORE',
    publisher: 'STONE.STORE',
    alternates: {
        canonical: 'https://stone-store.app',
    },
    category: 'fashion',
    classification: 'Premium Fashion Store',
    other: {
        'fl-verify': 'a6c47674034a632b9efd21d8e889d253',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://stone-store.app',
        siteName: 'STONE.STORE',
        title: 'STONE.STORE - Premium Gray Fashion & Lifestyle',
        description: 'Discover our curated collection of premium gray clothes at STONE.STORE. Shop sustainable fashion with fast delivery and exceptional service. Because you deserve the best!',
        images: [
            {
                url: 'https://stone-store.app/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'STONE.STORE - Premium Gray Fashion Collection',
                type: 'image/jpeg',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'STONE.STORE - Premium Gray Fashion & Lifestyle',
        description: 'Discover our curated collection of premium gray clothes at STONE.STORE. Shop sustainable fashion with fast delivery and exceptional service.',
        images: ['https://stone-store.app/og-image.jpg'],
        creator: '@stonestore',
        site: '@stonestore',
    },
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/favicon.ico', sizes: 'any' }
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
        ],
        shortcut: ['/favicon.ico']
    },
    manifest: '/site.webmanifest',
    robots: {
        index: true,
        follow: true,
        nocache: true,
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
        other: {
            'norton-safeweb': 'your-norton-verification',
            'facebook-domain-verification': 'your-facebook-verification',
            'msvalidate.01': 'your-bing-verification'
        }
    },
    applicationName: 'STONE.STORE',
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    colorScheme: 'dark light',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
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