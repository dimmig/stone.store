import { prisma } from './prisma';
import { HfInference } from '@huggingface/inference';
import { Pinecone } from '@pinecone-database/pinecone';
import { Product, Category, Review } from '@prisma/client';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
});

const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'stone-store';
const VECTOR_DIMENSION = 384; // Dimension for all-MiniLM-L6-v2 model

interface EmbeddingData {
  id: string;
  type: 'product';
  content: string;
  metadata: Record<string, any>;
  embedding: number[];
}

interface ProductWithRelations extends Product {
  category: Category;
  reviews: Review[];
}

function ensureNumberArray(embedding: number | number[] | number[][] | (number | number[] | number[][])[]): number[] {
  if (Array.isArray(embedding)) {
    if (embedding.length === 0) return [];
    if (typeof embedding[0] === 'number') return embedding as number[];
    if (Array.isArray(embedding[0])) return embedding[0] as number[];
  }
  return [embedding as number];
}

async function generateEmbedding(text: string): Promise<number[]> {
  const embedding = await hf.featureExtraction({
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    inputs: text,
  });
  return ensureNumberArray(embedding);
}

async function ensureIndexExists() {
  const existingIndexes = await pinecone.listIndexes();
  const indexExists = existingIndexes.indexes?.some((index: { name: string }) => index.name === INDEX_NAME);

  if (!indexExists) {
    await pinecone.createIndex({
      name: INDEX_NAME,
      dimension: VECTOR_DIMENSION,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1',
        },
      },
    });
    console.log(`Created new Pinecone index: ${INDEX_NAME}`);
  } else {
    console.log(`Using existing Pinecone index: ${INDEX_NAME}`);
  }
}

const pineconeIndex = pinecone.index(INDEX_NAME);

async function getProductEmbeddings(): Promise<EmbeddingData[]> {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      reviews: true,
    },
  });

  return Promise.all(
    products.map(async (product) => {
      const textToEmbed = `
        Product: ${product.name}
        Description: ${product.description}
        Price: $${product.price}
        Category: ${product.category.name}
        Stock: ${product.stockQuantity}
        Rating: ${product.rating}
        Sizes: ${product.sizes.join(', ')}
        Colors: ${product.colors.join(', ')}
        Reviews: ${product.reviews.map(r => r.comment).join(' ')}
      `.trim();

      return {
        id: `product_${product.id}`,
        type: 'product',
        content: textToEmbed,
        metadata: {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category.name,
          stockQuantity: product.stockQuantity,
          rating: product.rating,
          productId: product.id,
        },
        embedding: await generateEmbedding(textToEmbed),
      };
    })
  );
}

export async function initializeKnowledgeBase() {
  try {
    await ensureIndexExists();

    // Get embeddings from all data sources
    const productEmbeddings = await getProductEmbeddings();

    // Upsert all embeddings to Pinecone
    await pineconeIndex.upsert(
      productEmbeddings.map((data) => ({
        id: data.id,
        values: data.embedding,
        metadata: {
          ...data.metadata,
          type: data.type,
        },
      }))
    );

    return { success: true, message: 'Knowledge base initialized successfully' };
  } catch (error) {
    console.error('Error initializing knowledge base:', error);
    throw error;
  }
}

export async function updateProductEmbeddings(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        reviews: true,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const textToEmbed = `
      Product: ${product.name}
      Description: ${product.description}
      Price: $${product.price}
      Category: ${product.category.name}
      Stock: ${product.stockQuantity}
      Rating: ${product.rating}
      Sizes: ${product.sizes.join(', ')}
      Colors: ${product.colors.join(', ')}
      Reviews: ${product.reviews.map(r => r.comment).join(' ')}
    `.trim();

    const embedding = await generateEmbedding(textToEmbed);

    await pineconeIndex.upsert({
      id: `product_${productId}`,
      values: embedding,
      metadata: {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category.name,
        stockQuantity: product.stockQuantity,
        rating: product.rating,
        productId: product.id,
        type: 'product',
      },
    });

    return { success: true, message: 'Product embeddings updated successfully' };
  } catch (error) {
    console.error('Error updating product embeddings:', error);
    throw error;
  }
}

export async function getAllProducts(): Promise<ProductWithRelations[]> {
  try {
    return await prisma.product.findMany({
      include: {
        category: true,
        reviews: true,
      },
    });
  } catch (error) {
    console.error('Error getting all products:', error);
    return [];
  }
}

export async function getRelevantContent(query: string, limit: number = 3): Promise<{
  products: ProductWithRelations[];
}> {
  try {
    // If query is empty or just a greeting, return all products
    if (!query.trim() || /^(hi|hello|hey|greetings|what products|show products)/i.test(query)) {
      const allProducts = await getAllProducts();
      return { products: allProducts };
    }

    const queryEmbedding = await generateEmbedding(query);

    const queryResponse = await pineconeIndex.query({
      vector: queryEmbedding,
      topK: limit,
      includeMetadata: true,
    });

    const matches = queryResponse.matches || [];
    const productIds = matches
      .filter((match: any) => match.metadata.type === 'product')
      .map((match: any) => match.metadata.productId)
      .slice(0, limit);

    // If no matches found, return all products
    if (productIds.length === 0) {
      const allProducts = await getAllProducts();
      return { products: allProducts };
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true, reviews: true },
    });

    return { products };
  } catch (error) {
    console.error('Error getting relevant content:', error);
    // On error, try to return all products
    const allProducts = await getAllProducts();
    return { products: allProducts };
  }
}

export async function generateContext(products: ProductWithRelations[]): Promise<string> {
  const productContext = products
    .map(
      (product) => `
Product: ${product.name}
Description: ${product.description}
Price: $${product.price}
Category: ${product.category.name}
Stock: ${product.stockQuantity}
Rating: ${product.rating}
Sizes: ${product.sizes.join(', ')}
Colors: ${product.colors.join(', ')}
Reviews: ${product.reviews.length} reviews with average rating of ${product.rating}
`
    )
    .join('\n');

  return productContext.trim();
} 