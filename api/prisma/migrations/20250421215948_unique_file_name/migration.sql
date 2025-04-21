/*
  Warnings:

  - A unique constraint covering the columns `[name,tenantId]` on the table `file` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `file_version` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "file_name_tenantId_key" ON "file"("name", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "file_version_id_key" ON "file_version"("id");
