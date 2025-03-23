import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadToGCS } from '@/lib/gcs';
import { deleteFromGCS } from '@/lib/gcs';

export async function GET(req: Request) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
      orderBy: [
        {
          name: 'asc'
        }
      ]
    });

    // Move "Uncategorized" to the end of the list
    const sortedCategories = [...categories].sort((a, b) => {
      if (a.name === 'Uncategorized') return 1;
      if (b.name === 'Uncategorized') return -1;
      return 0;
    });

    return NextResponse.json(sortedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const productIds = JSON.parse(formData.get('productIds') as string);
    const currentImageUrls = JSON.parse(formData.get('currentImageUrls') as string);
    const images = formData.getAll('images') as File[];

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    let imageUrl = currentImageUrls[0] || null;

    if (images.length > 0) {
      try {
        const { url } = await uploadToGCS(images[0]);
        imageUrl = url;
      } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    try {
      const category = await prisma.category.create({
        data: {
          name,
          description,
          image: imageUrl,
          products: {
            connect: productIds.map((id: string) => ({ id })),
          },
        },
        include: {
          products: true,
        },
      });

      return NextResponse.json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const productIds = JSON.parse(formData.get('productIds') as string);
    const shouldReplaceImage = formData.get('shouldReplaceImage') === 'true';
    const currentImageUrls = shouldReplaceImage ? [] : JSON.parse(formData.get('currentImageUrls') as string);
    const images = formData.getAll('images') as File[];

    if (!id || !name?.trim()) {
      return NextResponse.json(
        { error: 'ID and name are required' },
        { status: 400 }
      );
    }

    let imageUrl = currentImageUrls[0] || undefined;

    if (images.length > 0) {
      try {
        // If we're replacing the image, delete the old one from GCS
        if (shouldReplaceImage) {
          const oldCategory = await prisma.category.findUnique({
            where: { id },
            select: { image: true }
          });
          
          if (oldCategory?.image) {
            try {
              const filename = oldCategory.image.split('/').pop();
              if (filename) {
                await deleteFromGCS(filename);
              }
            } catch (error) {
              // Log the error but continue with the update
              console.error('Error deleting old image from GCS:', error);
              // Don't throw the error as we want to continue with the update
            }
          }
        }

        const { url } = await uploadToGCS(images[0]);
        imageUrl = url;
      } catch (error) {
        console.error('Error handling image:', error);
        return NextResponse.json(
          { error: 'Failed to handle image' },
          { status: 500 }
        );
      }
    }

    try {
      // First, update the category's basic information
      const category = await prisma.category.update({
        where: { id },
        data: {
          name,
          description,
          ...(imageUrl && { image: imageUrl }),
        },
        include: {
          products: true,
        },
      });

      // Then, update the products' category references
      if (productIds && productIds.length > 0) {
        await prisma.product.updateMany({
          where: {
            id: {
              in: productIds
            }
          },
          data: {
            categoryId: id
          }
        });
      }

      // Fetch the updated category with its products
      const updatedCategory = await prisma.category.findUnique({
        where: { id },
        include: {
          products: true,
        },
      });

      return NextResponse.json(updatedCategory);
    } catch (error) {
      console.error('Error updating category:', error);
      return NextResponse.json(
        { error: 'Failed to update category' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    try {
      // First, get the category to get the image URL
      const category = await prisma.category.findUnique({
        where: { id },
        select: { image: true }
      });

      // Try to delete the image from GCS if it exists, but don't fail if it doesn't
      if (category?.image) {
        try {
          const filename = category.image.split('/').pop();
          if (filename) {
            try {
              await deleteFromGCS(filename);
            } catch (gcsError) {
              // Log the error but continue with category deletion
              console.error('Error deleting image from GCS:', gcsError);
              // Don't throw the error as we want to continue with the category deletion
            }
          }
        } catch (error) {
          // Log any other errors but continue with category deletion
          console.error('Error processing image URL:', error);
        }
      }

      // Find or create the "Uncategorized" category
      let uncategorizedCategory = await prisma.category.findFirst({
        where: { name: 'Uncategorized' }
      });

      if (!uncategorizedCategory) {
        uncategorizedCategory = await prisma.category.create({
          data: {
            name: 'Uncategorized',
            description: 'Default category for products without a specific category'
          }
        });
      }

      // Move all products from the current category to the Uncategorized category
      await prisma.product.updateMany({
        where: { categoryId: id },
        data: { categoryId: uncategorizedCategory.id }
      });

      // Then delete the category
      await prisma.category.delete({
        where: { id },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting category:', error);
      return NextResponse.json(
        { error: 'Failed to delete category' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 