/*
  Warnings:

  - A unique constraint covering the columns `[referenceStation,trainNumber]` on the table `TrainArrival` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TrainArrival_referenceStation_trainNumber_key" ON "TrainArrival"("referenceStation", "trainNumber");
