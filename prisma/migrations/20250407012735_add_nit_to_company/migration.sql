/*
  Warnings:

  - A unique constraint covering the columns `[nit]` on the table `company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,tenantId]` on the table `department` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nit` to the `company` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `file` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_userId_fkey";

-- AlterTable
ALTER TABLE "company" ADD COLUMN     "nit" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "file" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "uk_company_nit" ON "company"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "department_name_tenantId_key" ON "department"("name", "tenantId");

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
