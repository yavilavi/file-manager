/*
  Warnings:

  - You are about to drop the `files` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "files";

-- CreateTable
CREATE TABLE "file" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "extension" VARCHAR(20),
    "mimeType" VARCHAR(150) NOT NULL,
    "hash" VARCHAR(255) NOT NULL,
    "size" INTEGER NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "tenantId" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tenantId" VARCHAR(15) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(20) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "departmentId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_file_name" ON "file"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uk_file_hash" ON "file"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "uk_company_name" ON "company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uk_company_tenantId" ON "company"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_tenantId_key" ON "user"("username", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_tenantId_key" ON "user"("email", "tenantId");

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "company"("tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "company"("tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "company"("tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
