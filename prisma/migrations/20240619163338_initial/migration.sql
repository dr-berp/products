/*
  Warnings:

  - Made the column `createdBy` on table `product_codes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "product_codes" ALTER COLUMN "createdBy" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "createdBy" SET NOT NULL;
