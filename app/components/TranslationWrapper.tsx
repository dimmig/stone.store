'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateElement } from '@/lib/translator';

export function TranslationWrapper({ children }: { children: React.ReactNode }) {
    const { language } = useLanguage();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const isTranslatingRef = useRef(false);
    const observerRef = useRef<MutationObserver | null>(null);

    // Function to translate all content
    const translateContent = async () => {
        if (!wrapperRef.current || isTranslatingRef.current) return;
        
        try {
            isTranslatingRef.current = true;
            
            // Disconnect observer temporarily to prevent infinite loops
            observerRef.current?.disconnect();

            // Translate main content sections
            const elements = wrapperRef.current.querySelectorAll('main, header, footer, nav, [data-translate]');
            console.log(`[TranslationWrapper] Found ${elements.length} elements to translate`);
            
            // Translate all elements in parallel
            await Promise.all(Array.from(elements).map(element => 
                translateElement(element as HTMLElement, language)
            ));

            // Reconnect observer
            if (observerRef.current && wrapperRef.current) {
                observerRef.current.observe(wrapperRef.current, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }
        } catch (error) {
            console.error('[TranslationWrapper] Translation error:', error);
        } finally {
            isTranslatingRef.current = false;
        }
    };

    // Initial translation and observer setup
    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (typeof window === 'undefined' || !wrapper) return;

        const setupObserver = () => {
            // Create observer for dynamic content
            observerRef.current = new MutationObserver((mutations) => {
                // Only trigger translation if we're not already translating
                if (!isTranslatingRef.current) {
                    const hasTextChanges = mutations.some(mutation => 
                        mutation.type === 'childList' || 
                        mutation.type === 'characterData'
                    );
                    
                    if (hasTextChanges) {
                        translateContent();
                    }
                }
            });

            // Start observing
            if (observerRef.current && wrapper) {
                observerRef.current.observe(wrapper, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }
        };

        // Setup observer and do initial translation
        setupObserver();
        translateContent();

        return () => {
            observerRef.current?.disconnect();
            observerRef.current = null;
        };
    }, []); // Only run once on mount

    // Trigger translation when language changes
    useEffect(() => {
        if (typeof window === 'undefined') return;
        console.log('[TranslationWrapper] Language changed to:', language);
        translateContent();
    }, [language]); // Re-run when language changes

    return (
        <div ref={wrapperRef} lang={language.toLowerCase()}>
            {children}
        </div>
    );
} 