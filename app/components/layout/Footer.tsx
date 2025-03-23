import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { typography } from '../../styles/design-system';

const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com' },
    { icon: Facebook, href: 'https://facebook.com' },
    { icon: Twitter, href: 'https://twitter.com' },
    { icon: Youtube, href: 'https://youtube.com' }
];

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 opacity-90"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className={`${typography.h4} mb-4`}>About Us</h3>
                        <p className={`${typography.body} text-gray-400`}>
                            We're dedicated to bringing you the latest fashion trends with uncompromising quality.
                        </p>
                    </div>
                    <div>
                        <h3 className={`${typography.h4} mb-4`}>Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/store" className="text-gray-400 hover:text-white transition-colors">Shop</Link></li>
                            <li><Link href="/collections" className="text-gray-400 hover:text-white transition-colors">Collections</Link></li>
                            <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className={`${typography.h4} mb-4`}>Customer Service</h3>
                        <ul className="space-y-2">
                            <li><Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping</Link></li>
                            <li><Link href="/returns" className="text-gray-400 hover:text-white transition-colors">Returns</Link></li>
                            <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className={`${typography.h4} mb-4`}>Connect With Us</h3>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <Link
                                    key={index}
                                    href={social.href}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <social.icon className="w-6 h-6" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Stone Store. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
} 