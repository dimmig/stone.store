import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadToGCS, deleteFromGCS } from '@/app/lib/gcs';
import { Prisma } from '@prisma/client';

interface RouteParams {
  params: {
    productId: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { productId: string } }
) {
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
    const currentImageUrls = JSON.parse(formData.get('currentImageUrls') as string) || [];
    const currentImageFilenames = JSON.parse(formData.get('currentImageFilenames') as string) || [];
    const newImages = formData.getAll('images') as File[];

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

    // Get existing product to check current images
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.productId },
      select: {
        imageUrls: true,
        imageFilenames: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Find images that were removed
    const imagesToDelete = existingProduct.imageFilenames.filter(
      (filename: string) => !currentImageFilenames.includes(filename)
    );

    console.log('Images to delete:', imagesToDelete);

    try {
      for (const filename of imagesToDelete) {
        await deleteFromGCS(filename);
        console.log('Successfully deleted image from GCS:', filename);
      }
    } catch (error) {
      console.error('Error deleting images from GCS:', error);
      return NextResponse.json(
        { error: 'Failed to delete images from storage' },
        { status: 500 }
      );
    }

    // Upload new images to GCS
    const newImageUrls: string[] = [];
    const newImageFilenames: string[] = [];

    try {
      for (const image of newImages) {
        const { url, filename } = await uploadToGCS(image);
        newImageUrls.push(url);
        newImageFilenames.push(filename);
        console.log('Successfully uploaded image:', url);
      }
    } catch (error) {
      console.error('Error uploading images to GCS:', error);
      return NextResponse.json(
        { error: 'Failed to upload images to storage' },
        { status: 500 }
      );
    }

    // Update product with new data
    const updatedProduct = await prisma.product.update({
      where: { id: params.productId },
      data: {
        name,
        description,
        price,
        categoryId,
        sizes,
        colors,
        stockQuantity,
        rating: 4.5,
        imageUrls: [...currentImageUrls, ...newImageUrls],
        imageFilenames: [...currentImageFilenames, ...newImageFilenames],
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get product to delete images from GCS
    const product = await prisma.product.findUnique({
      where: { id: params.productId },
      select: {
        imageFilenames: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete images from GCS
    try {
      for (const filename of product.imageFilenames) {
        await deleteFromGCS(filename);
        console.log('Successfully deleted image from GCS:', filename);
      }
    } catch (error) {
      console.error('Error deleting images from GCS:', error);
      return NextResponse.json(
        { error: 'Failed to delete images from storage' },
        { status: 500 }
      );
    }

    // Delete all related records first
    try {
      // Delete related cart items
      await prisma.cartItem.deleteMany({
        where: { productId: params.productId },
      });

      // Delete related wishlist items
      await prisma.wishlistItem.deleteMany({
        where: { productId: params.productId },
      });

      // Delete related order items
      await prisma.orderItem.deleteMany({
        where: { productId: params.productId },
      });

      // Delete related reviews
      await prisma.review.deleteMany({
        where: { productId: params.productId },
      });

      // Finally, delete the product
      await prisma.product.delete({
        where: { id: params.productId },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting product and related records:', error);
      return NextResponse.json(
        { error: 'Failed to delete product and related records' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 