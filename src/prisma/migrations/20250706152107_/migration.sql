-- CreateTable
CREATE TABLE "TrainArrival" (
    "id" TEXT NOT NULL,
    "majorSection" TEXT NOT NULL,
    "referenceStation" TEXT NOT NULL,
    "trainNumber" TEXT NOT NULL,
    "arrivalTime" TEXT NOT NULL,
    "arrivedOrNot" BOOLEAN NOT NULL DEFAULT false,
    "arrivedTime" TIMESTAMP(3),
    "affectingStations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainArrival_pkey" PRIMARY KEY ("id")
);
