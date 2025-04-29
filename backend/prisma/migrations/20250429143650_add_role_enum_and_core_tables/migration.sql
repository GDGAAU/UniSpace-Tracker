-- AlterTable
ALTER TABLE "occupancy" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- RenameIndex
ALTER INDEX "Occupancy_unique" RENAME TO "occupancy_classroomId_startTime_endTime_userId_key";
