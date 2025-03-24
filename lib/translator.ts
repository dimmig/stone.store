'use client';

import axios from 'axios';

// Add type declarations at the top of the file
declare global {
    interface Window {
        __translations: Record<string, Partial<Record<SupportedLanguages, string>>>;
        __pageTranslations: Record<string, Record<string, string>>;
        __currentTargetLang: SupportedLanguages;
    }
}

export type SupportedLanguages = 'EN' | 'PL' | 'UK';

interface TranslationResponse {
    translations: Array<{
        text: string;
    }>;
}

const TRANSLATIONS_STORAGE_KEY = 'stone-store-translations';
const PAGE_TRANSLATIONS_KEY = 'stone-store-page-translations';
const BATCH_SIZE = 50; // Maximum texts to translate in one API call

// Initialize translations cache
if (typeof window !== 'undefined') {
    try {
        const storedTranslations = localStorage.getItem(TRANSLATIONS_STORAGE_KEY);
        const storedPageTranslations = localStorage.getItem(PAGE_TRANSLATIONS_KEY);
        window.__translations = storedTranslations ? JSON.parse(storedTranslations) : {};
        window.__pageTranslations = storedPageTranslations ? JSON.parse(storedPageTranslations) : {};
        window.__currentTargetLang = 'EN'; // Initialize with default language
    } catch (error) {
        console.error('[Translator] Error initializing translations:', error);
        window.__translations = {};
        window.__pageTranslations = {};
        window.__currentTargetLang = 'EN';
    }
}

// Helper to save translations to cache
function saveToCache(texts: string[], translations: string[], targetLang: SupportedLanguages) {
    if (!texts.length || !translations.length) return;
    
    texts.forEach((text, index) => {
        const translation = translations[index];
        if (!translation) return;
        
        if (!window.__translations[text]) {
            window.__translations[text] = {
                EN: text, // Always store original text as English
                [targetLang]: translation
            };
        } else {
            window.__translations[text][targetLang] = translation;
        }
    });
    
    try {
        localStorage.setItem(TRANSLATIONS_STORAGE_KEY, JSON.stringify(window.__translations));
    } catch (error) {
        console.error('[Translator] Error saving to cache:', error);
    }
}

// Batch translate multiple texts
async function batchTranslate(texts: string[], targetLang: SupportedLanguages): Promise<string[]> {
    if (!texts.length || targetLang === 'EN') return texts;


    try {

        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                texts,
                targetLang,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            if (response.status === 429) {
                // Return cached translations if available, otherwise return original texts
                return texts.map(text => window.__translations[text]?.[targetLang] || text);
            }
            throw new Error(error.message || 'Translation failed');
        }

        const data = await response.json() as TranslationResponse;
        
        if (!data?.translations?.length) {
            throw new Error('Empty translation response');
        }


        const translations = data.translations.map(t => t.text);
        saveToCache(texts, translations, targetLang);
        return translations;
    } catch (error) {
        // Return cached translations if available, otherwise return original texts
        return texts.map(text => window.__translations[text]?.[targetLang] || text);
    }
}

export async function translateText(text: string, targetLang: SupportedLanguages = 'EN'): Promise<string> {
    if (!text?.trim() || targetLang === 'EN') return text;

    // Check cache first
    if (window.__translations[text]?.[targetLang]) {
        return window.__translations[text][targetLang];
    }

    const translations = await batchTranslate([text], targetLang);
    return translations[0];
}

export async function translateTexts(texts: string[], targetLang: SupportedLanguages = 'EN'): Promise<string[]> {
    if (targetLang === 'EN') return texts;

    try {
        const uniqueTexts = Array.from(new Set(texts)).filter(text => text?.trim());
        const uncachedTexts = uniqueTexts.filter(text => !window.__translations[text]?.[targetLang]);

        if (uncachedTexts.length === 0) {
            return texts.map(text => window.__translations[text]?.[targetLang] || text);
        }


        // Translate all uncached texts in one request
        const translations = await batchTranslate(uncachedTexts, targetLang);

        // Return all translations (including cached ones)
        return texts.map(text => 
            text?.trim() 
                ? (window.__translations[text]?.[targetLang] || text)
                : text
        );
    } catch (error) {
        console.error('[Translator] Error in translateTexts:', error);
        return texts.map(text => window.__translations[text]?.[targetLang] || text);
    }
}

// Function to collect all translatable text from an element and its children
export function collectTranslatableText(element: HTMLElement): { node: Text; text: string }[] {
    const textPairs: { node: Text; text: string }[] = [];
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                const parent = node.parentElement;
                if (!parent) return NodeFilter.FILTER_REJECT;

                // Skip if parent is in these tags
                if (['SCRIPT', 'STYLE', 'CODE', 'PRE'].includes(parent.tagName)) {
                    return NodeFilter.FILTER_REJECT;
                }

                // Skip if parent has data-no-translate
                if (parent.hasAttribute('data-no-translate') || parent.closest('[data-no-translate]')) {
                    return NodeFilter.FILTER_REJECT;
                }

                // Skip if text is empty or only whitespace
                const text = node.textContent?.trim();
                if (!text) return NodeFilter.FILTER_REJECT;

                // Only skip if text is in cache AND the node already has the translated content
                const cachedTranslation = window.__translations[text]?.[window.__currentTargetLang];
                if (cachedTranslation && node.textContent?.trim() === cachedTranslation.trim()) {
                    return NodeFilter.FILTER_REJECT;
                }

                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    let node: Text | null;
    while ((node = walker.nextNode() as Text)) {
        const text = node.textContent?.trim() || '';
        if (text) {
            textPairs.push({ node, text });
        }
    }

    return textPairs;
}

// Function to apply translations to collected text nodes
function applyTranslations(textPairs: { node: Text; text: string }[], translations: string[]) {
    textPairs.forEach(({ node, text }, index) => {
        const newText = translations[index];
        if (!newText) return;

        const parent = node.parentElement as HTMLElement;
        if (!parent) return;

        // Add responsive text handling to parent
        parent.classList.add('text-dynamic');
        
        // If parent is a button or navigation item, add flex-dynamic
        if (parent.tagName === 'BUTTON' || parent.tagName === 'A' || 
            parent.getAttribute('role') === 'button' || 
            parent.getAttribute('role') === 'navigation') {
            parent.classList.add('flex-dynamic');
        }

        // If text is in a header or navigation, add truncation
        if (parent.tagName === 'H1' || parent.tagName === 'H2' || 
            parent.tagName === 'H3' || parent.tagName === 'H4' || 
            parent.closest('nav')) {
            parent.classList.add('text-truncate');
        }

        // Update the text content while preserving surrounding whitespace
        const currentText = node.textContent || '';
        const leadingWhitespace = currentText.match(/^\s*/)?.[0] || '';
        const trailingWhitespace = currentText.match(/\s*$/)?.[0] || '';
        node.textContent = leadingWhitespace + newText + trailingWhitespace;
        
        // Set language attribute
        parent.setAttribute('lang', window.__currentTargetLang.toLowerCase());

        // If text got significantly longer, add multi-line truncation
        if (newText.length > text.length * 1.5) {
            parent.classList.add('text-truncate-2');
        }
    });
}

// Helper to generate a unique key for the current page state
function getPageKey(element: HTMLElement): string {
    const path = window.location.pathname;
    const content = element.innerText.trim();
    return `${path}-${content.substring(0, 50)}`; // Use first 50 chars of content as fingerprint
}

// Helper to save page translations to cache
function savePageTranslations(element: HTMLElement, translations: Map<string, string>, targetLang: SupportedLanguages) {
    const pageKey = getPageKey(element);
    const langKey = `${pageKey}-${targetLang}`;
    
    window.__pageTranslations[langKey] = Object.fromEntries(translations);
    
    try {
        localStorage.setItem(PAGE_TRANSLATIONS_KEY, JSON.stringify(window.__pageTranslations));
    } catch (error) {
        console.error('[Translator] Error saving page translations:', error);
    }
}

// Helper to get cached page translations
function getPageTranslations(element: HTMLElement, targetLang: SupportedLanguages): Map<string, string> | null {
    const pageKey = getPageKey(element);
    const langKey = `${pageKey}-${targetLang}`;
    
    const cached = window.__pageTranslations[langKey];
    return cached ? new Map(Object.entries(cached)) : null;
}

// Function to translate an HTML element and all its text nodes
export async function translateElement(element: HTMLElement, targetLang: SupportedLanguages) {
    if (targetLang === 'EN') return;

    try {
        // Store current target language globally for the collector to use
        window.__currentTargetLang = targetLang;

        // Check for cached page translations first
        const cachedTranslations = getPageTranslations(element, targetLang);
        if (cachedTranslations) {
            // Apply cached translations directly
            const textPairs = collectTranslatableText(element);
            const translations = textPairs.map(pair => cachedTranslations.get(pair.text) || pair.text);
            applyTranslations(textPairs, translations);
            return;
        }

        // Collect all translatable text
        const textPairs = collectTranslatableText(element);
        
        if (!textPairs.length) {
            return;
        }


        // Extract unique texts for translation
        const uniqueTexts = Array.from(new Set(textPairs.map(pair => pair.text)));

        // Add translation loading state
        element.classList.add('translating');
        
        try {
            // Translate all texts at once
            const translations = await translateTexts(uniqueTexts, targetLang);
            
            // Create a map of original text to translation
            const translationMap = new Map(uniqueTexts.map((text, i) => [text, translations[i]]));
            
            // Save page translations to cache
            savePageTranslations(element, translationMap, targetLang);
            
            // Map the translations back to the original order
            const orderedTranslations = textPairs.map(pair => translationMap.get(pair.text) || pair.text);
            
            applyTranslations(textPairs, orderedTranslations);
            
        } finally {
            element.classList.remove('translating');
        }
    } catch (error) {
        element.classList.remove('translating');
    }
}

type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export async function translateObject<T extends Record<string, any>>(
    obj: T,
    targetLang: SupportedLanguages = 'EN'
): Promise<T> {
    const translatedObj = { ...obj } as DeepPartial<T>;

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            translatedObj[key as keyof T] = await translateText(value, targetLang) as T[keyof T];
        } else if (typeof value === 'object' && value !== null) {
            translatedObj[key as keyof T] = await translateObject(value, targetLang) as T[keyof T];
        }
    }

    return translatedObj as T;
} 