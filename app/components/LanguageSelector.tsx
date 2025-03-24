'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { SupportedLanguages } from '@/lib/translator';
import { useCallback, useEffect, useState } from 'react';

const languageFlags: Record<SupportedLanguages, string> = {
    EN: '🇬🇧',
    PL: '🇵🇱',
    UK: '🇺🇦'
};

const languageNames: Record<SupportedLanguages, string> = {
    EN: 'English',
    PL: 'Polski',
    UK: 'Українська'
};

export default function LanguageSelector() {
    const { language, setLanguage, isLoading } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageChange = useCallback(async (newLang: SupportedLanguages) => {
        setIsOpen(false);
        setLanguage(newLang);
    }, [setLanguage]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.language-selector')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div 
            className="language-selector relative"
            onKeyDown={handleKeyDown}
        >
            <button
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                    ${isOpen ? 'bg-gray-100' : ''}`}
                onClick={() => !isLoading && setIsOpen(!isOpen)}
                disabled={isLoading}
                aria-expanded={isOpen}
                aria-label="Select language"
            >
                <span className="text-xl" role="img" aria-label={languageNames[language]}>
                    {languageFlags[language]}
                </span>
                {isLoading && (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full mt-1 right-0 bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[160px]">
                    {Object.entries(languageFlags).map(([code, flag]) => (
                        <button
                            key={code}
                            className={`w-full flex items-center px-4 py-2 space-x-3 hover:bg-gray-50 transition-colors
                                ${code === language ? 'bg-gray-50' : ''}`}
                            onClick={() => handleLanguageChange(code as SupportedLanguages)}
                        >
                            <span className="text-xl" role="img" aria-label={languageNames[code as SupportedLanguages]}>
                                {flag}
                            </span>
                            <span className="flex-grow text-left">
                                {languageNames[code as SupportedLanguages]}
                            </span>
                            {code === language && (
                                <span className="text-green-500">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
} 