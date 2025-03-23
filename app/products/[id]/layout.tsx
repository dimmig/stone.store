import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return {
    ...product,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray', 'Navy']
  };
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId,
      id: {
        not: currentProductId
      }
    },
    take: 4,
    select: {
      id: true,
      name: true,
      price: true,
      imageUrls: true,
      rating: true,
    },
  });

  return relatedProducts.map(product => ({
    ...product,
    images: ['/images/products/1.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray', 'Navy']
  }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function ProductLayout({ children, params }: LayoutProps) {
  const product = await getProduct(params.id);
  const relatedProducts = await getRelatedProducts(product.categoryId, params.id);

  const props = {
    params,
    product,
    relatedProducts
  };

  return (
    <div>
      {React.cloneElement(children as React.ReactElement, props)}
    </div>
  );
} 