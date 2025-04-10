/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `file` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `file` will be added. If there are existing duplicate values, this will fail.

*/

-- DropIndex
DROP INDEX "uk_file_hash";

-- DropIndex
DROP INDEX "uk_file_name";

-- CreateIndex
CREATE UNIQUE INDEX uk_file_hash
  ON "file" (hash)
  WHERE "deletedAt" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX uk_file_name
  ON "file" (name)
  WHERE "deletedAt" IS NULL;
