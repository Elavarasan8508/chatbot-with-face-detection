-- CreateTable
CREATE TABLE "dailydata" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "currentStatus" TEXT,
    "todayTast" INTEGER NOT NULL DEFAULT 0,
    "workingDay" BOOLEAN NOT NULL DEFAULT false,
    "inTime" DATETIME,
    "outTime" DATETIME,
    "EmployeeSatisfaction" TEXT,
    "WorkQuality" TEXT,
    "jobTenure" INTEGER NOT NULL,
    "overTimeDuration" INTEGER NOT NULL DEFAULT 0,
    "lateDuration" INTEGER NOT NULL DEFAULT 0,
    "stress" INTEGER NOT NULL DEFAULT 0,
    "BreakDuration" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "dailydata_date_key" ON "dailydata"("date");
