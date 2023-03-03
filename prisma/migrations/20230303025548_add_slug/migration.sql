/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `NetlifyAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "NetlifyAccount" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "NetlifyAccount_slug_key" ON "NetlifyAccount"("slug");
