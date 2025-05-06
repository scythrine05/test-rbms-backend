/*
  Warnings:

  - You are about to drop the column `archived` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `cautionLocationFrom` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `cautionLocationTo` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `cautionRequired` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `cautionSpeed` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `freshCautionLocation` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `otherLinesAffected` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `selectedLine` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `selectedRoads` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `selectedStream` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `selectedStreams` on the `Request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Request" DROP COLUMN "archived",
DROP COLUMN "cautionLocationFrom",
DROP COLUMN "cautionLocationTo",
DROP COLUMN "cautionRequired",
DROP COLUMN "cautionSpeed",
DROP COLUMN "department",
DROP COLUMN "freshCautionLocation",
DROP COLUMN "otherLinesAffected",
DROP COLUMN "selectedLine",
DROP COLUMN "selectedRoads",
DROP COLUMN "selectedStream",
DROP COLUMN "selectedStreams";
