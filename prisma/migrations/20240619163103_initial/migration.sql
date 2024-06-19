-- AlterTable
ALTER TABLE "product_codes" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;
