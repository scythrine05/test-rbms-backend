-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "adminRequestStatus" TEXT DEFAULT 'PENDING',
ADD COLUMN     "applicantMobile" TEXT,
ADD COLUMN     "applicantName" TEXT,
ADD COLUMN     "availedResponse" TEXT,
ADD COLUMN     "cautionDurationDays" INTEGER,
ADD COLUMN     "isSanctioned" BOOLEAN DEFAULT false,
ADD COLUMN     "machineBlockClearingStation" TEXT,
ADD COLUMN     "numberOfTrackMachines" INTEGER,
ADD COLUMN     "optimizeStatus" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "optimizeTimeFrom" TIMESTAMP(3),
ADD COLUMN     "optimizeTimeTo" TIMESTAMP(3),
ADD COLUMN     "powerBlockMastFrom" TEXT,
ADD COLUMN     "powerBlockMastTo" TEXT,
ADD COLUMN     "reasonForReject" TEXT,
ADD COLUMN     "remarkByManager" TEXT,
ADD COLUMN     "sanctionedTimeFrom" TIMESTAMP(3),
ADD COLUMN     "sanctionedTimeTo" TIMESTAMP(3),
ADD COLUMN     "siteSupervisorMobile" TEXT,
ADD COLUMN     "siteSupervisorName" TEXT,
ADD COLUMN     "userResponse" TEXT,
ADD COLUMN     "userStatus" TEXT;

-- CreateTable
CREATE TABLE "Optimize_Table" (
    "id" TEXT NOT NULL,
    "optimizeTimeFrom" TIMESTAMP(3) NOT NULL,
    "optimizeTimeTo" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "missionBlock" TEXT NOT NULL,
    "otherAffectedLine" TEXT NOT NULL,
    "selectedDepartment" TEXT NOT NULL,
    "selectedDepo" TEXT NOT NULL,
    "selectedLine" TEXT NOT NULL,
    "selectedSection" TEXT NOT NULL,
    "selectedStream" TEXT NOT NULL,
    "isEdited" BOOLEAN DEFAULT false,

    CONSTRAINT "Optimize_Table_pkey" PRIMARY KEY ("id")
);
