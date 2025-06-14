/*
  Warnings:

  - You are about to drop the column `applicantMobile` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `applicantName` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `cautionDurationDays` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `machineBlockClearingStation` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfTrackMachines` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `powerBlockMastFrom` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `powerBlockMastTo` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `siteSupervisorMobile` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `siteSupervisorName` on the `Request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Request" DROP COLUMN "applicantMobile",
DROP COLUMN "applicantName",
DROP COLUMN "cautionDurationDays",
DROP COLUMN "machineBlockClearingStation",
DROP COLUMN "numberOfTrackMachines",
DROP COLUMN "powerBlockMastFrom",
DROP COLUMN "powerBlockMastTo",
DROP COLUMN "siteSupervisorMobile",
DROP COLUMN "siteSupervisorName",
ADD COLUMN     "workNature" TEXT;
