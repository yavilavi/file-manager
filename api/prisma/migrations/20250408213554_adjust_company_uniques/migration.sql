/*
  Warnings:

  - You are about to alter the column `tenantId` on the `department` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `tenantId` on the `file` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `name` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(30)`.
  - You are about to alter the column `tenantId` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.

*/
-- DropForeignKey
ALTER TABLE "department"
  DROP CONSTRAINT "department_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "file"
  DROP CONSTRAINT "file_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "user"
  DROP CONSTRAINT "user_tenantId_fkey";

-- DropIndex
DROP INDEX "uk_company_nit";

-- CreateIndex
CREATE UNIQUE INDEX uk_company_nit
  ON "company" (nit)
  WHERE "deletedAt" IS NULL;

-- AlterTable
ALTER TABLE "department"
  ALTER COLUMN "tenantId" SET DATA TYPE VARCHAR(15);

-- AlterTable
ALTER TABLE "file"
  ALTER COLUMN "tenantId" SET DATA TYPE VARCHAR(15);

-- AlterTable
ALTER TABLE "user"
  ALTER COLUMN "name" SET DATA TYPE VARCHAR(30),
  ALTER COLUMN "email" SET DATA TYPE VARCHAR(30),
  ALTER COLUMN "tenantId" SET DATA TYPE VARCHAR(15);

-- AddForeignKey
ALTER TABLE "file"
  ADD CONSTRAINT "file_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "company" ("tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department"
  ADD CONSTRAINT "department_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "company" ("tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"
  ADD CONSTRAINT "user_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "company" ("tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;
