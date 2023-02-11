/*
  Warnings:

  - Made the column `name` on table `NetlifyAccount` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NetlifyAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL
);
INSERT INTO "new_NetlifyAccount" ("email", "id", "name", "token") SELECT "email", "id", "name", "token" FROM "NetlifyAccount";
DROP TABLE "NetlifyAccount";
ALTER TABLE "new_NetlifyAccount" RENAME TO "NetlifyAccount";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
