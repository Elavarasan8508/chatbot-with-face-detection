-- CreateTable
CREATE TABLE "mental_health_assessments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sadness" BOOLEAN NOT NULL DEFAULT false,
    "euphoric" BOOLEAN NOT NULL DEFAULT false,
    "exhausted" BOOLEAN NOT NULL DEFAULT false,
    "sleep_disorder" BOOLEAN NOT NULL DEFAULT false,
    "mood_swing" BOOLEAN NOT NULL DEFAULT false,
    "suicidal_thoughts" BOOLEAN NOT NULL DEFAULT false,
    "anorexia" BOOLEAN NOT NULL DEFAULT false,
    "authority_respect" BOOLEAN NOT NULL DEFAULT false,
    "try_explanation" BOOLEAN NOT NULL DEFAULT false,
    "aggressive_response" BOOLEAN NOT NULL DEFAULT false,
    "ignore_and_move_on" BOOLEAN NOT NULL DEFAULT false,
    "nervous_breakdown" BOOLEAN NOT NULL DEFAULT false,
    "admit_mistakes" BOOLEAN NOT NULL DEFAULT false,
    "overthinking" BOOLEAN NOT NULL DEFAULT false,
    "concentration" INTEGER NOT NULL DEFAULT 5,
    "optimism" INTEGER NOT NULL DEFAULT 5,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
