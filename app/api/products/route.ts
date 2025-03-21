import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const priceRange = searchParams.get('priceRange');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const inStock = searchParams.get('inStock') === 'true';

    // Parse price range
    let priceFilter = {};
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      priceFilter = {
        price: {
          ...(min && { gte: min }),
          ...(max && { lte: max }),
          ...(priceRange === '200-' && { gte: 200 })
        }
      };
    }

    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
          category ? { categoryId: category } : {},
          priceFilter,
          inStock ? { inStock: true } : {},
        ],
      },
      include: {
        category: true,
        wishlistItems: true,
      },
      orderBy: sortBy === 'price-asc'
          ? { price: 'asc' }
          : sortBy === 'price-desc'
              ? { price: 'desc' }
              : sortBy === 'popular'
                  ? { views: 'desc' }
                  : { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}