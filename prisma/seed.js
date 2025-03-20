const { PrismaClient } = require('@prisma/client');
const mockData = require('../mock_data/data.json');

const prisma = new PrismaClient();

async function main() {
  // Create a test admin user
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@stonestore.com',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9.m',
      role: 'ADMIN',
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 