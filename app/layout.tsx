import React from 'react';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import '../styles/globals.css';
import {HeaderWrapper} from './components/layout/HeaderWrapper';
import {Footer} from './components/layout/Footer';
import {Providers} from './providers/Providers';
import {ClientProviders} from './providers/ClientProviders';
import {Toaster} from "sonner";

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'Stone.Store - Premium Clothing & Accessories',
    description: 'Your premier destination for high-quality clothing and accessories.',
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