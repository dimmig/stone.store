import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import '../../styles/globals.css';
import { HeaderWrapper } from '../components/layout/HeaderWrapper';
import { Providers } from '../providers/Providers';
import { ClientProviders } from '../providers/ClientProviders';
import { Toaster } from "sonner";
import Footer from '../components/layout/Footer';
import { locales, defaultLocale } from '@/lib/i18n/config';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Stone Store',
  description: 'Your one-stop shop for all your needs',
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function RootLayout({ children, params: { locale = defaultLocale } }: RootLayoutProps) {
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <ClientProviders>
          <Providers>
            <HeaderWrapper />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <Analytics />
          </Providers>
        </ClientProviders>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
} 