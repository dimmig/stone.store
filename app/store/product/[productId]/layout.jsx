import "@/styles/globals.css";
import { Nunito } from "next/font/google";
import Head from "next/head";
import {Menu} from "@/components/Store/Menu";
import {Header} from "@/components/Store/Header";

const nunito = Nunito({ subsets: ["latin"] });

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <div className={nunito.className}>
                <Header/>
                <div className='sticky top-0  bg-white shadow-lg shadow-black/5 z-100'>
                    <Menu/>
                </div>
                <main>{children}</main>
            </div>
        </>
    );
}
