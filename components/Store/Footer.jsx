import Image from "next/image";
import {cn} from "@/lib/utils";
import Link from "next/link";

const Footer = ({ className }) => {
    return (
        <div className={cn("mt-20 w-full py-10 border-t-2 border-t-gray-100", className)}>
            <div className="flex-around flex-wrap max-[900px]:gap-16">
                <div className="flex flex-col">
                    <h3 className="text-4xl font-bold">Products</h3>
                    <div className="flex flex-row gap-10 mt-5">
                        <div className="flex flex-col gap-2">
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Shirt</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">T-shirts</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Jeans</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Shorts</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Socks</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Belts</Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Hoodies</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Sweetshots</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Jackets</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Shirts</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Ties</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Wallets</Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <h3 className="text-4xl font-bold">Colections</h3>
                    <div className="flex flex-row gap-10 mt-5 flex-center">
                        <div className="flex flex-col gap-2">
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Business</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Casual</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Winter</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Autmn</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Summer</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Spring</Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-center">
                    <h3 className="text-4xl font-bold">About us</h3>
                    <div className="flex flex-row gap-10 mt-5 flex-center">
                        <div className="flex flex-col gap-2 flex-center">
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Company</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Founders</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">
                                How we produce our clothes
                            </Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Media feedback</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Future plans</Link>
                            <Link href="#" className="text-xl footer-item hover:text-[#0000EE]">Privacy policy</Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-center">
                    <h3 className="text-4xl font-bold">Subscribe us</h3>
                    <div className="flex flex-row gap-10 mt-5 flex-center">
                        <div className="flex flex-col gap-5 flex-start">
                            <div className="flex flex-row gap-5">
                                <Image
                                    src="/assets/icons/insta.svg"
                                    width={35}
                                    height={35}
                                    className="footer-icon"
                                    alt="instagram icon"
                                />
                                <Link href="#" className="text-xl hover:text-[#0000EE]">Instagram</Link>
                            </div>
                            <div className="flex flex-row gap-5">
                                <Image
                                    src="/assets/icons/facebook.svg"
                                    width={35}
                                    height={35}
                                    className="footer-icon"
                                    alt="facebook icon"
                                />
                                <Link href="#" className="text-xl hover:text-[#0000EE]">Facebook</Link>
                            </div>
                            <div className="flex flex-row gap-5">
                                <Image
                                    src="/assets/icons/telegram.svg"
                                    width={35}
                                    height={35}
                                    className="footer-icon"
                                    alt="telegram icon"
                                />
                                <Link href="#" className="text-xl hover:text-[#0000EE]">Telegram</Link>
                            </div>
                            <div className="flex flex-row gap-5">
                                <Image
                                    src="/assets/icons/email.svg"
                                    width={35}
                                    height={35}
                                    className="footer-icon"
                                    alt="email icon"
                                />
                                <Link href="#" className="text-xl hover:text-[#0000EE]">Write to support</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
