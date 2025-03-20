import "@/styles/globals.css";
import { Inter } from 'next/font/google';
import Head from "next/head";
import { NextAuthProvider } from './providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Stone.Store - Elegant Clothing',
  description: 'Discover our collection of elegant clothing in shades of gray and other stylish options.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
          <Toaster position="bottom-right" />
        </NextAuthProvider>
      </body>
    </html>
  );
}
