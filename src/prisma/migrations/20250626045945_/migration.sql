/*
  Warnings:

  - A unique constraint covering the columns `[divisionId]` on the table `Request` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Request_divisionId_key" ON "Request"("divisionId");
