import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

type ChatMessageWithRole = {
  role: string;
  content: string;
};

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

    const prompt = `You are a helpful AI assistant for Stone Store. Be concise, friendly, and helpful. Focus on providing accurate information about products, orders, shipping, returns, and other store-related queries.

Previous conversation:
${formattedHistory}

===
Your response (without any prefix):`;

    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.95,
      },
    });

    let aiResponse = response.generated_text.split('===').pop()?.trim() || '';
    aiResponse = aiResponse
      .replace(/^(Your response \(without any prefix\)|Assistant|A|Reply):\s*/i, '')
      .replace(/^"|"$/g, '')
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .trim();

    if (!aiResponse) {
      aiResponse = "I apologize, but I couldn't process your request properly. Could you please rephrase your question?";
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
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
} 