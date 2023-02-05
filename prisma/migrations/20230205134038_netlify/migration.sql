/*
  Warnings:

  - Added the required column `email` to the `NetlifyAccount` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NetlifyAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL
);
INSERT INTO "new_NetlifyAccount" ("id", "token") SELECT "id", "token" FROM "NetlifyAccount";
DROP TABLE "NetlifyAccount";
ALTER TABLE "new_NetlifyAccount" RENAME TO "NetlifyAccount";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
