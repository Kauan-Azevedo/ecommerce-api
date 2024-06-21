-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_id_permission_idx" ON "User"("id_permission");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_permission_fkey" FOREIGN KEY ("id_permission") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
