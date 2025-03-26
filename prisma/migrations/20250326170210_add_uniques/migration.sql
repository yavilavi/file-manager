/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `files` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "uk_file_name" ON "files"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uk_file_hash" ON "files"("hash");
