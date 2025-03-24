'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { SupportedLanguages } from '@/lib/translator';
import { useState, useRef, useEffect } from 'react';

const languages: { code: SupportedLanguages; name: string; flag: string }[] = [
    { code: 'EN', name: 'English', flag: '🇬🇧' },
    { code: 'PL', name: 'Polski', flag: '🇵🇱' },
    { code: 'UK', name: 'Українська', flag: '🇺🇦' },
];

export default function LanguageSelector() {
    const { language, setLanguage, isLoading } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all duration-200 
                    ${isLoading 
                        ? 'bg-gray-100 cursor-not-allowed opacity-70' 
                        : 'border-gray-300 hover:bg-gray-50'} 
                    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-label="Select language"
                data-no-translate
            >
                <span className="text-base">{currentLanguage.flag}</span>
                <span className="hidden md:inline">{currentLanguage.name}</span>
                {isLoading ? (
                    <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                ) : (
                    <svg
                        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </button>

            {isOpen && !isLoading && (
                <div 
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                    data-no-translate
                >
                    <div className="py-1" role="menu">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors
                                    ${language === lang.code
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                role="menuitem"
                                disabled={isLoading}
                            >
                                <span>{lang.flag}</span>
                                <span>{lang.name}</span>
                                {language === lang.code && (
                                    <svg className="ml-auto h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 