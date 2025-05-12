/*
  Warnings:

  - The `adminAcceptance` column on the `Request` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Request" DROP COLUMN "adminAcceptance",
ADD COLUMN     "adminAcceptance" BOOLEAN NOT NULL DEFAULT true;
