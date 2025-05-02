-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "department" TEXT,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "managerId" TEXT,
    "adminId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "selectedDepartment" TEXT NOT NULL,
    "selectedSection" TEXT NOT NULL,
    "stationID" TEXT NOT NULL,
    "missionBlock" TEXT NOT NULL,
    "workType" TEXT NOT NULL,
    "workDescription" TEXT NOT NULL,
    "selectedLine" JSONB NOT NULL,
    "selectedStream" TEXT,
    "cautionRequired" BOOLEAN NOT NULL DEFAULT false,
    "cautionSpeed" INTEGER,
    "cautionLocationFrom" TEXT,
    "cautionLocationTo" TEXT,
    "workLocationFrom" TEXT NOT NULL,
    "workLocationTo" TEXT NOT NULL,
    "demandTimeFrom" TIMESTAMP(3) NOT NULL,
    "demandTimeTo" TIMESTAMP(3) NOT NULL,
    "sigDisconnection" BOOLEAN,
    "elementarySectionFrom" TEXT,
    "elementarySectionTo" TEXT,
    "sigElementarySectionFrom" TEXT,
    "sigElementarySectionTo" TEXT,
    "repercussions" TEXT,
    "otherLinesAffected" JSONB,
    "requestremarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT DEFAULT 'PENDING',
    "selectedDepo" TEXT,
    "sigResponse" TEXT DEFAULT 'yes',
    "ohDisconnection" TEXT,
    "oheDisconnection" TEXT,
    "oheResponse" TEXT DEFAULT 'yes',
    "corridorType" TEXT DEFAULT 'corridor',
    "sigActionsNeeded" BOOLEAN DEFAULT true,
    "trdActionsNeeded" BOOLEAN DEFAULT true,
    "ManagerResponse" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "sigDisconnectionRequirements" TEXT,
    "trdDisconnectionRequirements" TEXT,
    "userId" TEXT,
    "managerId" TEXT,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validTill" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "Request_userId_idx" ON "Request"("userId");

-- CreateIndex
CREATE INDEX "Request_managerId_idx" ON "Request"("managerId");

-- CreateIndex
CREATE INDEX "Request_createdAt_idx" ON "Request"("createdAt");

-- CreateIndex
CREATE INDEX "Otp_userId_idx" ON "Otp"("userId");

-- CreateIndex
CREATE INDEX "Otp_validTill_idx" ON "Otp"("validTill");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "fk_user_requests" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "fk_manager_requests" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
