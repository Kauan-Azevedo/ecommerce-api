/*
  Warnings:

  - Added the required column `statusid` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "statusid" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Status_name_key" ON "Status"("name");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_statusid_fkey" FOREIGN KEY ("statusid") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
