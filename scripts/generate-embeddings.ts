import { PrismaClient } from '@prisma/client';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';

const prisma = new PrismaClient();
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\n\n', '\n', ' ', ''],
});

async function generateProductEmbeddings() {
  try {
    // Get all products
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    // Create vector store
    const vectorStore = await SupabaseVectorStore.fromTexts(
      products.map((product) => {
        const text = `
          Product: ${product.name}
          Description: ${product.description}
          Price: $${product.price}
          Category: ${product.category.name}
          Stock: ${product.stockQuantity}
          Rating: ${product.rating}
          ${product.sizes.length > 0 ? `Available Sizes: ${product.sizes.join(', ')}` : ''}
          ${product.colors.length > 0 ? `Available Colors: ${product.colors.join(', ')}` : ''}
        `.trim();
        return text;
      }),
      products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
      })),
      embeddings,
      {
        supabaseClient: supabase,
        tableName: 'product_embeddings',
      }
    );

    console.log('Successfully generated and stored embeddings for all products');
  } catch (error) {
    console.error('Error generating embeddings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateProductEmbeddings(); 