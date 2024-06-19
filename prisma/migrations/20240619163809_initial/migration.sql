/*
  Warnings:

  - You are about to drop the column `enabled` on the `product_codes` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_codes" DROP COLUMN "enabled";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "enabled";
