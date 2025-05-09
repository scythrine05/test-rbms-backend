-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'JUNIOR_OFFICER', 'SENIOR_OFFICER', 'BRANCH_OFFICER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "Acceptance" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "depot" TEXT NOT NULL,
    "department" TEXT,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "managerId" TEXT,
    "location" TEXT NOT NULL,
    "adminId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "selectedDepartment" TEXT NOT NULL,
    "selectedSection" TEXT NOT NULL,
    "stationID" TEXT,
    "missionBlock" TEXT NOT NULL,
    "workType" TEXT NOT NULL,
    "activity" TEXT,
    "freshCautionRequired" BOOLEAN DEFAULT false,
    "freshCautionSpeed" INTEGER,
    "freshCautionLocationFrom" TEXT,
    "freshCautionLocationTo" TEXT,
    "adjacentLinesAffected" TEXT,
    "workLocationFrom" TEXT,
    "workLocationTo" TEXT,
    "demandTimeFrom" TIMESTAMP(3) NOT NULL,
    "demandTimeTo" TIMESTAMP(3) NOT NULL,
    "sigDisconnection" BOOLEAN DEFAULT false,
    "elementarySection" TEXT,
    "elementarySectionTo" TEXT,
    "sigElementarySectionFrom" TEXT,
    "sigElementarySectionTo" TEXT,
    "repercussions" TEXT,
    "trdWorkLocation" TEXT,
    "requestremarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT DEFAULT 'PENDING',
    "selectedDepo" TEXT,
    "sigResponse" TEXT DEFAULT 'yes',
    "ohDisconnection" TEXT,
    "oheDisconnection" TEXT,
    "oheResponse" TEXT DEFAULT 'yes',
    "corridorType" TEXT DEFAULT 'corridor',
    "corridorTypeSelection" TEXT,
    "sigActionsNeeded" BOOLEAN DEFAULT true,
    "trdActionsNeeded" BOOLEAN DEFAULT true,
    "ManagerResponse" TEXT,
    "sigDisconnectionRequirements" TEXT,
    "sntDisconnectionRequirements" JSONB,
    "sntDisconnectionLine" TEXT,
    "sntDisconnectionLineFrom" TEXT,
    "sntDisconnectionLineTo" TEXT,
    "trdDisconnectionRequirements" TEXT,
    "powerBlockRequirements" JSONB,
    "powerBlockRequired" BOOLEAN DEFAULT false,
    "sntDisconnectionRequired" BOOLEAN DEFAULT false,
    "processedLineSections" JSONB,
    "routeFrom" TEXT,
    "routeTo" TEXT,
    "DisconnAcceptance" "Acceptance" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT,
    "managerAcceptanceId" TEXT,
    "managerAcceptance" BOOLEAN NOT NULL DEFAULT false,

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

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "Request_managerAcceptanceId_idx" ON "Request"("managerAcceptanceId");

-- CreateIndex
CREATE INDEX "Request_createdAt_idx" ON "Request"("createdAt");

-- CreateIndex
CREATE INDEX "Otp_userId_idx" ON "Otp"("userId");

-- CreateIndex
CREATE INDEX "Otp_validTill_idx" ON "Otp"("validTill");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
