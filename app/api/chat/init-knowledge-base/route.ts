import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { initializeKnowledgeBase } from '@/lib/rag';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);


  try {
    const result = await initializeKnowledgeBase();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to initialize knowledge base:', error);
    return NextResponse.json(
      { error: 'Failed to initialize knowledge base' },
      { status: 500 }
    );
  }
} 