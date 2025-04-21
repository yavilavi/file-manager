/*
  Warnings:

  - Made the column `extension` on table `file` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "file" ADD COLUMN     "documentType" VARCHAR(50),
ALTER COLUMN "extension" SET NOT NULL;

-- CreateTable
CREATE TABLE "file_version" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "hash" VARCHAR(255) NOT NULL,
    "size" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,
    "isLast" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_file_version_id" 
  ON "file_version"("id")
  WHERE "isLast" = true AND "deletedAt" IS NULL;

-- AddForeignKey
ALTER TABLE "file_version" ADD CONSTRAINT "file_version_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
