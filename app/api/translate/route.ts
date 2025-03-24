import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

// Increased chunk size since we're handling the entire page
const CHUNK_SIZE = 50;
const MAX_RETRIES = 3;
const MIN_REQUEST_INTERVAL = 200; // Reduced to 200ms between requests

async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeTranslationRequest(texts: string[], targetLang: string, retries = MAX_RETRIES) {
    try {
        const response = await axios.post(
            'https://api-free.deepl.com/v2/translate',
            {
                text: texts,
                target_lang: targetLang,
                source_lang: 'EN',
            },
            {
                headers: {
                    'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                timeout: 30000, // 30 second timeout
            }
        );

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 429 && retries > 0) {
                const retryAfter = parseInt(error.response.headers['retry-after'] || '1', 10);
                const waitTime = Math.min(retryAfter * 1000, 2000); // Max 2 second wait
                
                console.log(`[Translation API] Rate limited, waiting ${waitTime}ms before retry ${MAX_RETRIES - retries + 1}/${MAX_RETRIES}`);
                await wait(waitTime);
                return makeTranslationRequest(texts, targetLang, retries - 1);
            }
        }
        throw error;
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { texts, targetLang } = body;

        if (!texts?.length || !targetLang) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // Process all chunks in parallel with a small delay between each request
        const chunks = [];
        for (let i = 0; i < texts.length; i += CHUNK_SIZE) {
            chunks.push(texts.slice(i, i + CHUNK_SIZE));
        }

        const results = await Promise.all(
            chunks.map(async (chunk, index) => {
                if (index > 0) {
                    await wait(MIN_REQUEST_INTERVAL);
                }
                const response = await makeTranslationRequest(chunk, targetLang);
                return response.translations;
            })
        );

        return NextResponse.json({
            translations: results.flat()
        });
    } catch (error) {
        console.error('[Translation API] Error:', error);
        const status = error instanceof AxiosError ? error.response?.status || 500 : 500;
        const message = error instanceof AxiosError && error.response?.status === 429
            ? 'Translation service is busy, please try again in a few seconds'
            : 'Translation failed';

        return NextResponse.json({ error: message }, { status });
    }
} 