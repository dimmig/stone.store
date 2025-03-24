"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguages } from '@/lib/translator';

interface LanguageContextType {
    language: SupportedLanguages;
    setLanguage: (lang: SupportedLanguages) => void;
    isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'stone-store-language';
const TRANSLATIONS_STORAGE_KEY = 'stone-store-translations';

export function LanguageProvider({ children }: { children: ReactNode }) {
    // Always start with 'EN' to match server-side rendering
    const [language, setLanguageState] = useState<SupportedLanguages>('EN');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize language after mount
    useEffect(() => {
        const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguages;
        if (storedLanguage && storedLanguage !== language) {
            setLanguageState(storedLanguage);
        }
        setIsInitialized(true);

        // Load stored translations
        const storedTranslations = localStorage.getItem(TRANSLATIONS_STORAGE_KEY);
        if (storedTranslations) {
            try {
                window.__translations = JSON.parse(storedTranslations);
            } catch (error) {
                console.error('Failed to parse stored translations:', error);
                window.__translations = {};
            }
        } else {
            window.__translations = {};
        }
    }, []);

    const setLanguage = (newLanguage: SupportedLanguages) => {
        if (newLanguage === language) return;
        
        setIsLoading(true);
        setLanguageState(newLanguage);
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);

        // Small delay to ensure loading state is visible
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    // Don't render until we've initialized on the client
    if (!isInitialized) {
        return null;
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, isLoading }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

// Add type declaration for global translations
declare global {
    interface Window {
        __translations: Record<string, Partial<Record<SupportedLanguages, string>>>;
    }
} 