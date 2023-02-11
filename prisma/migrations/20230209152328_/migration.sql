/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `NetlifyAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `NetlifyAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NetlifyAccount_email_key" ON "NetlifyAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NetlifyAccount_token_key" ON "NetlifyAccount"("token");
