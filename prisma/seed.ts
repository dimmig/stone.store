import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@stone.store',
      name: 'Admin User',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Dresses',
        description: 'Elegant dresses for any occasion',
        image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Tops',
        description: 'Stylish tops and blouses',
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Outerwear',
        description: 'Jackets, coats, and more',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
      },
    }),
  ]);

  // Create products
  const products = await Promise.all([
    // Dresses
    prisma.product.create({
      data: {
        name: 'Elegant Evening Dress',
        description: 'A stunning evening dress perfect for special occasions',
        price: 299.99,
        images: [
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae',
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
        ],
        categoryId: categories[0].id,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy', 'Red'],
        inStock: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Summer Floral Dress',
        description: 'Light and breezy floral dress for summer days',
        price: 149.99,
        images: [
          'https://images.unsplash.com/photo-1572804013427-4d7ca7268217',
          'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa',
        ],
        categoryId: categories[0].id,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Floral Print', 'White'],
        inStock: true,
      },
    }),
    // Tops
    prisma.product.create({
      data: {
        name: 'Silk Wrap Blouse',
        description: 'An elegant wrap-style blouse with a flattering silhouette',
        price: 249.99,
        images: [
          'https://images.unsplash.com/photo-1564257631407-4deb1f99d992',
          'https://images.unsplash.com/photo-1578587018452-892bacefd3f2',
        ],
        categoryId: categories[1].id,
        sizes: ['S', 'M', 'L'],
        colors: ['White', 'Cream', 'Black'],
        inStock: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Classic White Shirt',
        description: 'A timeless white shirt for any occasion',
        price: 129.99,
        images: [
          'https://images.unsplash.com/photo-1598033129183-c4f50c736f10',
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35',
        ],
        categoryId: categories[1].id,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['White'],
        inStock: true,
      },
    }),
    // Outerwear
    prisma.product.create({
      data: {
        name: 'Leather Biker Jacket',
        description: 'Classic leather jacket with modern details',
        price: 499.99,
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5',
          'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504',
        ],
        categoryId: categories[2].id,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Brown'],
        inStock: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Wool Blend Coat',
        description: 'Elegant wool blend coat for cold weather',
        price: 399.99,
        images: [
          'https://images.unsplash.com/photo-1539533018447-63fcce2678e3',
          'https://images.unsplash.com/photo-1544022613-e87ca75a784a',
        ],
        categoryId: categories[2].id,
        sizes: ['S', 'M', 'L'],
        colors: ['Camel', 'Grey', 'Black'],
        inStock: true,
      },
    }),
  ]);

  console.log('Seed data created successfully!');
  console.log('Admin user created with email: admin@stone.store and password: admin123');
  console.log(`Created ${categories.length} categories`);
  console.log(`Created ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 