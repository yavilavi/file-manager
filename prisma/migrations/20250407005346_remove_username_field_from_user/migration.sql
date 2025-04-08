/*
  Warnings:

  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_username_tenantId_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "username";
