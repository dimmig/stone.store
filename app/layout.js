import "@/styles/globals.css";
import { Nunito } from "next/font/google";
import Head from "next/head";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
  title: "Stone store",
  description: "Sophistication in shades of gray",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <body className={nunito.className}>
      {children}
      </body>
    </html>
  );
}
