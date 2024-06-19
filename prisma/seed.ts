import { PrismaClient } from '@prisma/client';
import { envs } from 'src/config';

const prisma = new PrismaClient();

const main = async () => {
  // Truncate table and restart identity to reset the auto-increment id to 1 after seeding
  await prisma.$queryRaw`TRUNCATE TABLE "products" RESTART IDENTITY CASCADE;`;

  await prisma.product.create({
    data: {
      name: 'Product 1',
      description: 'Description 1',
      createdById: '5ff41c62-7d96-4111-a21c-6e2c57bbe55f',
      codes: {
        createMany: {
          data: [
            { code: 1, createdById: '5ff41c62-7d96-4111-a21c-6e2c57bbe55f' },
            { code: 2, createdById: '5ff41c62-7d96-4111-a21c-6e2c57bbe55f' },
          ],
        },
      },
    },
  });
};

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
