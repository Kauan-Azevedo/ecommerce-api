/*
  Warnings:

  - You are about to alter the column `value` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `value` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `DoublePrecision`.
  - You are about to drop the `OrderInfo` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `PaymentMethod` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `PaymentStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "OrderInfo" DROP CONSTRAINT "OrderInfo_order_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderInfo" DROP CONSTRAINT "OrderInfo_product_id_fkey";

-- DropIndex
DROP INDEX "Order_paymentMethodId_idx";

-- DropIndex
DROP INDEX "Order_paymentStatusId_idx";

-- DropIndex
DROP INDEX "Order_userId_idx";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "date" DROP DEFAULT,
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "value" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "deletedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "value" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "deletedAt" SET DATA TYPE TIMESTAMP(3);

-- DropTable
DROP TABLE "OrderInfo";

-- CreateTable
CREATE TABLE "Order_Info" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "Order_Info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_name_key" ON "PaymentMethod"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentStatus_name_key" ON "PaymentStatus"("name");

-- AddForeignKey
ALTER TABLE "Order_Info" ADD CONSTRAINT "Order_Info_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Info" ADD CONSTRAINT "Order_Info_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
