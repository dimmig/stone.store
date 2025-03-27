import { prisma } from './prisma';
import { HfInference } from '@huggingface/inference';
import { Pinecone } from '@pinecone-database/pinecone';
import { Product, Category, Review, Order, User, Address, CartItem, WishlistItem } from '@prisma/client';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
});

const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'stone-store';
const VECTOR_DIMENSION = 384; // Dimension for all-MiniLM-L6-v2 model
const pineconeIndex = pinecone.index(INDEX_NAME);

type EntityType = 'product' | 'category' | 'order' | 'review' | 'user' | 'address' | 'cart' | 'wishlist';

interface EmbeddingData {
  id: string;
  type: EntityType;
  content: string;
  metadata: Record<string, any>;
  embedding: number[];
}

interface ProductWithRelations extends Product {
  category: Category;
  reviews: Review[];
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
}

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

interface OrderWithRelations extends Order {
  items: OrderItem[];
  user: User;
  shippingAddress: Address;
}

interface CategoryWithRelations extends Category {
  products: Product[];
}

interface UserWithRelations extends User {
  orders: Order[];
  addresses: Address[];
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
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

async function getProductEmbeddings(): Promise<EmbeddingData[]> {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      reviews: true,
      cartItems: true,
      wishlistItems: true,
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
        Cart Items: ${product.cartItems.length}
        Wishlist Items: ${product.wishlistItems.length}
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

async function getCategoryEmbeddings(): Promise<EmbeddingData[]> {
  const categories = await prisma.category.findMany({
    include: {
      products: true,
    },
  });

  return Promise.all(
    categories.map(async (category) => {
      const textToEmbed = `
        Category: ${category.name}
        Description: ${category.description || 'No description available'}
        Number of Products: ${category.products.length}
        Products: ${category.products.map(p => p.name).join(', ')}
      `.trim();

      return {
        id: `category_${category.id}`,
        type: 'category',
        content: textToEmbed,
        metadata: {
          name: category.name,
          description: category.description,
          categoryId: category.id,
          productCount: category.products.length,
        },
        embedding: await generateEmbedding(textToEmbed),
      };
    })
  );
}

async function getOrderEmbeddings(): Promise<EmbeddingData[]> {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
      user: true,
      shippingAddress: true,
    },
  });

  return Promise.all(
    orders.map(async (order) => {
      const textToEmbed = `
        Order ID: ${order.id}
        User: ${order.user.name || order.user.email}
        Total: $${order.total}
        Status: ${order.status}
        Shipping Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}
        Items: ${order.items.map(item => `${item.quantity}x ${item.productId}`).join(', ')}
        Created At: ${order.createdAt}
      `.trim();

      return {
        id: `order_${order.id}`,
        type: 'order',
        content: textToEmbed,
        metadata: {
          orderId: order.id,
          userId: order.userId,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
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
    const [productEmbeddings, categoryEmbeddings, orderEmbeddings] = await Promise.all([
      getProductEmbeddings(),
      getCategoryEmbeddings(),
      getOrderEmbeddings(),
    ]);

    // Combine all embeddings
    const allEmbeddings = [...productEmbeddings, ...categoryEmbeddings, ...orderEmbeddings];

    // Upsert all embeddings to Pinecone
    await pineconeIndex.upsert(
      allEmbeddings.map((data) => ({
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

export async function getRelevantContent(query: string, limit: number = 3): Promise<{
  products: ProductWithRelations[];
  categories: CategoryWithRelations[];
  orders: OrderWithRelations[];
}> {
  try {
    const queryEmbedding = await generateEmbedding(query);

    const queryResponse = await pineconeIndex.query({
      vector: queryEmbedding,
      topK: limit * 3, // Get more results to filter by type
      includeMetadata: true,
    });

    const matches = queryResponse.matches || [];
    
    // Filter matches by type and get IDs
    const productIds = matches
      .filter((match: any) => match.metadata.type === 'product')
      .map((match: any) => match.metadata.productId)
      .slice(0, limit);

    const categoryIds = matches
      .filter((match: any) => match.metadata.type === 'category')
      .map((match: any) => match.metadata.categoryId)
      .slice(0, limit);

    const orderIds = matches
      .filter((match: any) => match.metadata.type === 'order')
      .map((match: any) => match.metadata.orderId)
      .slice(0, limit);

    // Fetch all relevant data in parallel
    const [products, categories, orders] = await Promise.all([
      prisma.product.findMany({
        where: { id: { in: productIds } },
        include: { 
          category: true, 
          reviews: true,
          cartItems: true,
          wishlistItems: true
        },
      }),
      prisma.category.findMany({
        where: { id: { in: categoryIds } },
        include: { products: true },
      }),
      prisma.order.findMany({
        where: { id: { in: orderIds } },
        include: { items: true, user: true, shippingAddress: true },
      }),
    ]);

    return { products, categories, orders };
  } catch (error) {
    console.error('Error getting relevant content:', error);
    return { products: [], categories: [], orders: [] };
  }
}

export async function generateContext(products: ProductWithRelations[], categories: CategoryWithRelations[], orders: OrderWithRelations[]): Promise<string> {
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

  const categoryContext = categories
    .map(
      (category) => `
Category: ${category.name}
Description: ${category.description || 'No description available'}
Number of Products: ${category.products.length}
Products: ${category.products.map(p => p.name).join(', ')}
`
    )
    .join('\n');

  const orderContext = orders
    .map(
      (order) => `
Order ID: ${order.id}
User: ${order.user.name || order.user.email}
Total: $${order.total}
Status: ${order.status}
Shipping Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}
Items: ${order.items.map(item => `${item.quantity}x ${item.productId}`).join(', ')}
Created At: ${order.createdAt}
`
    )
    .join('\n');

  return `${productContext}\n${categoryContext}\n${orderContext}`.trim();
} 