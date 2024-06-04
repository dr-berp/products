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
      enabled: true,
      codes: {
        createMany: {
          data: [
            { code: 1, enabled: true },
            { code: 2, enabled: true },
          ],
        },
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Product 2',
      description: 'Description 2',
      enabled: true,
      codes: {
        createMany: {
          data: [
            { code: 3, enabled: true },
            { code: 4, enabled: true },
          ],
        },
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Product 3',
      description: 'Description 3',
      enabled: true,
      codes: {
        createMany: {
          data: [
            { code: 5, enabled: true },
            { code: 6, enabled: true },
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
