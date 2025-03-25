import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadToGCS } from '@/lib/gcs';

const prismaClient = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const priceRange = searchParams.get('priceRange');
    const stockFilter = searchParams.get('stockFilter');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as Prisma.SortOrder;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      ...(category && category !== 'all' && { categoryId: category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
      ...(priceRange && priceRange !== 'all' && {
        price: {
          ...(priceRange === 'under50' && { lt: 50 }),
          ...(priceRange === '50to100' && { gte: 50, lte: 100 }),
          ...(priceRange === 'over100' && { gt: 100 }),
        },
      }),
      ...(stockFilter && stockFilter !== 'all' && {
        stockQuantity: {
          ...(stockFilter === 'inStock' && { gt: 0 }),
          ...(stockFilter === 'outOfStock' && { equals: 0 }),
        },
      }),
    };

    // Build orderBy clause
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      ...(sortBy === 'newest' && { createdAt: sortOrder }),
      ...(sortBy === 'name' && { name: sortOrder }),
      ...(sortBy === 'price' && { price: sortOrder }),
      ...(sortBy === 'category' && { category: { name: sortOrder } }),
    };

    // Get total count for pagination
    const total = await prisma.product.count({ where });
    const totalPages = Math.ceil(total / limit);

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      products,
      total,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const categoryId = formData.get('categoryId') as string;
    const sizes = (formData.get('sizes') as string).split(',').filter(Boolean);
    const colors = (formData.get('colors') as string).split(',').filter(Boolean);
    const stockQuantity = parseInt(formData.get('stockQuantity') as string);
    const images = formData.getAll('images') as File[];
    const colorImageMapping = JSON.parse(formData.get('colorImageMapping') as string || '{}');

    // Validate each field individually
    const errors = [];
    if (!name?.trim()) errors.push('Name is required');
    if (!description?.trim()) errors.push('Description is required');
    if (isNaN(price) || price < 0) errors.push('Valid price is required');
    if (!categoryId?.trim()) errors.push('Category is required');
    if (isNaN(stockQuantity) || stockQuantity < 0) errors.push('Valid stock quantity is required');

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', details: errors },
        { status: 400 }
      );
    }

    // Upload images to Google Cloud Storage
    const imageUrls: string[] = [];
    const imageFilenames: string[] = [];

    try {
      for (const image of images) {
        const { url, filename } = await uploadToGCS(image);
        imageUrls.push(url);
        imageFilenames.push(filename);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      return NextResponse.json(
        { error: 'Failed to upload images' },
        { status: 500 }
      );
    }

    try {
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          categoryId,
          sizes,
          colors,
          rating: 4.5,
          discount: 0,
          stockQuantity,
          imageUrls,
          imageFilenames,
          colorImageMapping,
        },
        include: {
          category: true,
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
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}