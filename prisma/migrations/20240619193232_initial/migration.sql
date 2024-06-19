/*
  Warnings:

  - You are about to drop the column `createdBy` on the `product_codes` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `product_codes` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `products` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `product_codes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_codes" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedById" TEXT;
