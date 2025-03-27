import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { HfInference } from '@huggingface/inference';
import { getRelevantContent, generateContext } from '@/lib/rag';
import { Product, Category, Review } from '@prisma/client';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

type ChatMessageWithRole = {
  role: string;
  content: string;
};

type ProductWithRelations = Product & {
  category: Category;
  reviews: Review[];
};

// Helper function to retry API calls
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxRetries) break;
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
}

// Language detection and translation functions
async function detectLanguage(text: string): Promise<string> {
  try {
    const result = await retryWithBackoff(() => 
      hf.textClassification({
        model: 'papluca/xlm-roberta-base-language-detection',
        inputs: text,
      })
    );
    return result[0].label.split('__')[0]; // Returns language code (e.g., 'en', 'es', 'fr')
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en'; // Default to English if detection fails
  }
}

async function translateText(text: string, targetLang: string): Promise<string> {
  if (targetLang === 'en') return text;
  
  try {
    const result = await retryWithBackoff(() =>
      hf.translation({
        model: 'Helsinki-NLP/opus-mt-en-' + targetLang,
        inputs: text,
      })
    );
    return Array.isArray(result) ? result[0].translation_text : result.translation_text;
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Return original text if translation fails
  }
}

// Function to validate response against product data
function validateResponse(response: string, products: ProductWithRelations[]): string {
  // If no products are available, return a clear message
  if (!products || products.length === 0) {
    return "I don't have any product information available at the moment.";
  }

  // Check if the response contains any product names that aren't in our data
  const productNames = products.map(p => p.name.toLowerCase());
  const responseWords = response.toLowerCase().split(/\s+/);
  
  // If the response mentions a product not in our data, return a correction
  for (const word of responseWords) {
    if (word.length > 3 && !productNames.includes(word)) {
      return "I can only provide information about products in our catalog. Here are the products I have information about:\n\n" +
        products.map(p => `- ${p.name}: $${p.price} (${p.stockQuantity > 0 ? 'In stock' : 'Out of stock'})`).join('\n');
    }
  }

  return response;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    const messages = await prisma.$queryRaw`
      SELECT * FROM "ChatMessage"
      WHERE "sessionId" = ${sessionId}
      ORDER BY "createdAt" ASC
    `;
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sessionId, messages } = await req.json();

    if (!sessionId || !messages?.length) {
      return NextResponse.json({ error: 'Session ID and messages are required' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1] as ChatMessageWithRole;
    if (lastMessage.role !== 'user' || !lastMessage.content.trim()) {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
    }

    // Save user message
    await prisma.$executeRaw`
      INSERT INTO "ChatMessage" ("id", "sessionId", "role", "content", "createdAt")
      VALUES (gen_random_uuid(), ${sessionId}, 'user', ${lastMessage.content}, NOW())
    `;

    // Get chat history
    const chatHistory = await prisma.$queryRaw`
      SELECT * FROM "ChatMessage"
      WHERE "sessionId" = ${sessionId}
      ORDER BY "createdAt" ASC
    `;

    const formattedHistory = (chatHistory as any[])
      .map((msg) => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    // Detect the language of the user's query
    const userLanguage = await detectLanguage(lastMessage.content);

    // Get relevant content based on the user's query
    let context = '';
    let relevantProducts: ProductWithRelations[] = [];
    try {
      const { products } = await getRelevantContent(lastMessage.content);
      relevantProducts = products;
      context = await generateContext(products);
    } catch (error) {
      console.error('Error getting relevant content:', error);
      // Continue with empty context if retrieval fails
    }

    // Translate context to user's language if needed
    const translatedContext = context ? await translateText(context, userLanguage) : '';

    // Create a language-specific prompt that emphasizes using only the provided product data
    const prompt = `You are a helpful AI assistant for Stone Store. Your responses MUST be based ONLY on the product information provided below. You are NOT allowed to make up or hallucinate any products or information.

CRITICAL RULES:
1. ONLY use information from the provided product data
2. NEVER mention products that are not in the provided data
3. If asked about a product not in the data, respond with "I don't have information about that product"
4. If asked about shipping, returns, or other policies, respond with "I can only provide information about our products"
5. If no product information is available, say "I don't have any product information available at the moment"
6. Be precise with prices, stock levels, and other specific details
7. If the information is not available in the data, say "I don't have that specific information"
8. When listing products, include their prices and stock status

Previous conversation:
${formattedHistory}

${translatedContext ? `Available product information:
${translatedContext}` : 'No product information available.'}

===
Your response (without any prefix):`;

    const response = await retryWithBackoff(() =>
      hf.textGeneration({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.1, // Very low temperature for more deterministic responses
          top_p: 0.95,
          repetition_penalty: 1.2,
          do_sample: true,
        },
      })
    );

    let aiResponse = response.generated_text.split('===').pop()?.trim() || '';
    aiResponse = aiResponse
      .replace(/^(Your response \(without any prefix\)|Assistant|A|Reply):\s*/i, '')
      .replace(/^"|"$/g, '')
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .trim();

    // Validate the response against actual product data
    aiResponse = validateResponse(aiResponse, relevantProducts);

    if (!aiResponse) {
      aiResponse = userLanguage === 'en' 
        ? "I apologize, but I couldn't process your request properly. Could you please rephrase your question?"
        : "Lo siento, pero no pude procesar su solicitud correctamente. ¿Podría reformular su pregunta?";
    }

    // Save AI response and update session
    await Promise.all([
      prisma.$executeRaw`
        INSERT INTO "ChatMessage" ("id", "sessionId", "role", "content", "createdAt")
        VALUES (gen_random_uuid(), ${sessionId}, 'assistant', ${aiResponse}, NOW())
      `,
      prisma.$executeRaw`
        UPDATE "ChatSession"
        SET "updatedAt" = NOW()
        WHERE "id" = ${sessionId}
      `
    ]);

    return new Response(aiResponse, {
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
} 