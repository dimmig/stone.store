import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateProductEmbeddings } from '@/lib/rag';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const result = await updateProductEmbeddings(productId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to update embeddings:', error);
    return NextResponse.json(
      { error: 'Failed to update embeddings' },
      { status: 500 }
    );
  }
} 