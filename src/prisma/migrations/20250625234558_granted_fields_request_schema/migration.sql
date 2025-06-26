-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'PUNCTUALITY_CONTROLLER';
ALTER TYPE "Role" ADD VALUE 'DEPT_CONTROLLER';
ALTER TYPE "Role" ADD VALUE 'DRM';
ALTER TYPE "Role" ADD VALUE 'HQ';

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "AvailedTimeFrom" TIMESTAMP(3),
ADD COLUMN     "AvailedTimeTo" TIMESTAMP(3),
ADD COLUMN     "availedRemarks" TEXT,
ADD COLUMN     "divisionId" TEXT,
ADD COLUMN     "grantedFromTime" TIMESTAMP(3),
ADD COLUMN     "grantedToTime" TIMESTAMP(3),
ADD COLUMN     "powerBlockDisconnectionAssignTo" TEXT,
ADD COLUMN     "userAcceptanceForSanction" BOOLEAN NOT NULL DEFAULT false;
