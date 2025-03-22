import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const prismaClient = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const priceRange = searchParams.get('priceRange');
    const stockFilter = searchParams.get('stockFilter');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const color = searchParams.get('color');
    const size = searchParams.get('size');
    const rating = searchParams.get('rating');

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      AND: [
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
        category && category !== 'all' ? { categoryId: category } : {},
      ],
    };

    // Add price range filter
    if (priceRange && priceRange !== 'all') {
      let priceFilter = {};
      if (priceRange === '0-50' || priceRange === 'under50') {
        priceFilter = { lte: 50 };
      } else if (priceRange === '50-100') {
        priceFilter = { gte: 50, lte: 100 };
      } else if (priceRange === '100-200') {
        priceFilter = { gte: 100, lte: 200 };
      } else if (priceRange === '200-' || priceRange === 'over100') {
        priceFilter = { gte: 200 };
      }
      if (Object.keys(priceFilter).length > 0) {
        whereClause.AND.push({ price: priceFilter });
      }
    }

    // Add stock filter
    if (stockFilter && stockFilter !== 'all') {
      whereClause.AND.push({
        stockQuantity: stockFilter === 'inStock' ? { gt: 0 } : { equals: 0 },
      });
    }

    // Add color filter
    if (color && color !== 'all') {
      whereClause.AND.push({
        colors: {
          has: color,
        },
      });
    }

    // Add size filter
    if (size && size !== 'all') {
      whereClause.AND.push({
        sizes: {
          has: size,
        },
      });
    }

    // Add rating filter
    if (rating && rating !== 'all') {
      const minRating = parseFloat(rating);
      whereClause.AND.push({
        rating: {
          gte: minRating,
        },
      });
    }

    // Remove empty conditions
    whereClause.AND = whereClause.AND.filter(Boolean);

    // Build order by clause
    let orderBy: any = {};
    if (sortBy === 'newest') {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === 'price-asc') {
      orderBy.price = 'asc';
    } else if (sortBy === 'price-desc') {
      orderBy.price = 'desc';
    } else if (sortBy === 'popular') {
      orderBy.views = 'desc';
    } else if (sortBy === 'rating-desc') {
      orderBy.rating = 'desc';
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else if (sortBy === 'category') {
      orderBy.category = { name: sortOrder };
    }

    // Get total count for pagination
    const total = await prismaClient.product.count({
      where: whereClause,
    });

    // Get paginated products
    const products = await prismaClient.product.findMany({
      where: whereClause,
      include: {
        category: true,
        wishlistItems: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        images: data.images,
        sizes: data.sizes,
        colors: data.colors,
        stockQuantity: data.stockQuantity,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}