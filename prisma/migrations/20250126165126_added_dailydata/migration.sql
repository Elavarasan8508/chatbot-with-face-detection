/*
  Warnings:

  - You are about to drop the column `jobTenure` on the `dailydata` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "userdata" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "jobTenure" INTEGER
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_dailydata" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "currentStatus" TEXT,
    "todayTast" INTEGER NOT NULL DEFAULT 0,
    "workingDay" BOOLEAN NOT NULL DEFAULT false,
    "inTime" DATETIME,
    "outTime" DATETIME,
    "EmployeeSatisfaction" TEXT,
    "WorkQuality" TEXT,
    "overTimeDuration" INTEGER NOT NULL DEFAULT 0,
    "lateDuration" INTEGER NOT NULL DEFAULT 0,
    "stress" INTEGER NOT NULL DEFAULT 0,
    "BreakDuration" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_dailydata" ("BreakDuration", "EmployeeSatisfaction", "WorkQuality", "currentStatus", "date", "id", "inTime", "lateDuration", "outTime", "overTimeDuration", "stress", "todayTast", "workingDay") SELECT "BreakDuration", "EmployeeSatisfaction", "WorkQuality", "currentStatus", "date", "id", "inTime", "lateDuration", "outTime", "overTimeDuration", "stress", "todayTast", "workingDay" FROM "dailydata";
DROP TABLE "dailydata";
ALTER TABLE "new_dailydata" RENAME TO "dailydata";
CREATE UNIQUE INDEX "dailydata_date_key" ON "dailydata"("date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
