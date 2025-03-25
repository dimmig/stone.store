'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export function HeaderWrapper() {
    const pathname = usePathname();
    const isDashboard = pathname.includes('/dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Debug logs
    useEffect(() => {
        console.log('HeaderWrapper isMobileMenuOpen state changed:', isMobileMenuOpen);
    }, [isMobileMenuOpen]);

    const handleMobileMenuOpen = (isOpen: boolean) => {
        console.log('handleMobileMenuOpen called with:', isOpen);
        setIsMobileMenuOpen(isOpen);
    };

    if (isDashboard) {
        return null;
    }

    return (
        <>
            <Header isMobileMenuOpen={isMobileMenuOpen} onMobileMenuOpen={handleMobileMenuOpen} />
            <MobileNav isOpen={isMobileMenuOpen} onClose={() => handleMobileMenuOpen(false)} />
        </>
    );
} 