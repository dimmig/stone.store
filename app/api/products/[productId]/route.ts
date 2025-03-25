import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { GCSUploadResult, uploadMultipleToGCS, deleteFromGCS } from '@/app/lib/gcs';

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
    const colorImageMapping = JSON.parse(formData.get('colorImageMapping') as string || '{}');
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

    // Delete removed images in parallel
    if (imagesToDelete.length > 0) {
      await Promise.all(
        imagesToDelete.map(async (filename) => {
          try {
            await deleteFromGCS(filename);
          } catch (error) {
            // Continue with the update even if image deletion fails
          }
        })
      );
    }

    // Upload new images to GCS in parallel
    let newImageUrls: string[] = [];
    let newImageFilenames: string[] = [];

    if (newImages.length > 0) {
      try {
        const uploadResults = await uploadMultipleToGCS(newImages);
        newImageUrls = uploadResults.map((result: GCSUploadResult) => result.url);
        newImageFilenames = uploadResults.map((result: GCSUploadResult) => result.filename);
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to upload images to storage' },
          { status: 500 }
        );
      }
    }

    // Update product with new data
    const updateData = {
      name,
      description,
      price,
      category: {
        connect: { id: categoryId }
      },
      sizes,
      colors,
      stockQuantity,
      rating: 4.5,
      imageUrls: [...currentImageUrls, ...newImageUrls],
      imageFilenames: [...currentImageFilenames, ...newImageFilenames],
      colorImageMapping,
    };

    const updatedProduct = await prisma.product.update({
      where: { id: params.productId },
      data: updateData as unknown as Prisma.ProductUpdateInput,
      include: {
        category: true,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
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
      await Promise.all(
        product.imageFilenames.map(async (filename) => {
          try {
            await deleteFromGCS(filename);
          } catch (error) {
            // Continue if deletion fails
          }
        })
      );
    } catch (error) {
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
      return NextResponse.json(
        { error: 'Failed to delete product and related records' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 