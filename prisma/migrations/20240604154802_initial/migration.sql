/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `product_codes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `product_codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_codes" ADD COLUMN     "code" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_codes_code_key" ON "product_codes"("code");

-- CreateIndex
CREATE INDEX "product_codes_productId_idx" ON "product_codes"("productId");

-- CreateIndex
CREATE INDEX "product_codes_code_idx" ON "product_codes"("code");
