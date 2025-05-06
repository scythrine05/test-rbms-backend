/*
  Warnings:

  - You are about to drop the column `elementarySectionFrom` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `workDescription` on the `Request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Request" DROP COLUMN "elementarySectionFrom",
DROP COLUMN "workDescription",
ADD COLUMN     "activity" TEXT,
ADD COLUMN     "corridorTypeSelection" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "elementarySection" TEXT,
ADD COLUMN     "freshCautionLocation" TEXT,
ADD COLUMN     "freshCautionLocationFrom" TEXT,
ADD COLUMN     "freshCautionLocationTo" TEXT,
ADD COLUMN     "freshCautionRequired" BOOLEAN DEFAULT false,
ADD COLUMN     "freshCautionSpeed" INTEGER,
ADD COLUMN     "powerBlockRequired" BOOLEAN DEFAULT false,
ADD COLUMN     "powerBlockRequirements" JSONB,
ADD COLUMN     "processedLineSections" JSONB,
ADD COLUMN     "routeFrom" TEXT,
ADD COLUMN     "routeTo" TEXT,
ADD COLUMN     "selectedRoads" JSONB,
ADD COLUMN     "selectedStreams" JSONB,
ADD COLUMN     "sntDisconnectionLine" TEXT,
ADD COLUMN     "sntDisconnectionLineFrom" TEXT,
ADD COLUMN     "sntDisconnectionLineTo" TEXT,
ADD COLUMN     "sntDisconnectionRequired" BOOLEAN DEFAULT false,
ADD COLUMN     "sntDisconnectionRequirements" JSONB,
ALTER COLUMN "stationID" DROP NOT NULL,
ALTER COLUMN "workLocationFrom" DROP NOT NULL,
ALTER COLUMN "workLocationTo" DROP NOT NULL,
ALTER COLUMN "sigDisconnection" SET DEFAULT false;
