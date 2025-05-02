-- Drop existing Role enum and recreate with TEACHER
DROP TYPE IF EXISTS "Role";
CREATE TYPE "Role" AS ENUM ('STUDENT', 'REPRESENTATIVE', 'ADMIN', 'TEACHER');

-- Drop tables if they exist to ensure clean migration
DROP TABLE IF EXISTS "notification" CASCADE;
DROP TABLE IF EXISTS "occupancy" CASCADE;
DROP TABLE IF EXISTS "reservations" CASCADE;
DROP TABLE IF EXISTS "classrooms" CASCADE;
DROP TABLE IF EXISTS "floors" CASCADE;
DROP TABLE IF EXISTS "buildings" CASCADE;
DROP TABLE IF EXISTS "profile" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- CreateTable: users
CREATE TABLE "users" (
  "id" SERIAL NOT NULL,
  "username" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'STUDENT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable: buildings
CREATE TABLE "buildings" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "status" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable: floors
CREATE TABLE "floors" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "buildingId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "floors_pkey" PRIMARY KEY ("id")
);

-- CreateTable: classrooms
CREATE TABLE "classrooms" (
  "id" SERIAL NOT NULL,
  "floorId" INTEGER NOT NULL,
  "buildingId" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable: reservations
CREATE TABLE "reservations" (
  "id" SERIAL NOT NULL,
  "userId" INTEGER NOT NULL,
  "classroomId" INTEGER NOT NULL,
  "startTime" TIMESTAMP(3) NOT NULL,
  "endTime" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: occupancy
CREATE TABLE "occupancy" (
  "id" SERIAL NOT NULL,
  "userId" INTEGER NOT NULL,
  "classroomId" INTEGER NOT NULL,
  "startTime" TIMESTAMP(3) NOT NULL,
  "endTime" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'occupied',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "occupancy_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Occupancy_unique" UNIQUE ("classroomId", "startTime", "endTime", "userId")
);

-- CreateTable: notification
CREATE TABLE "notification" (
  "id" SERIAL NOT NULL,
  "userId" INTEGER NOT NULL,
  "reservationId" INTEGER,
  "message" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'INFO',
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable: profile
CREATE TABLE "profile" (
  "id" SERIAL NOT NULL,
  "userId" INTEGER NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "phone" TEXT,
  "address" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- Create Indexes
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Add Foreign Keys
ALTER TABLE "floors"
ADD CONSTRAINT "floors_buildingId_fkey"
FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "classrooms"
ADD CONSTRAINT "classrooms_floorId_fkey"
FOREIGN KEY ("floorId") REFERENCES "floors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "classrooms"
ADD CONSTRAINT "classrooms_buildingId_fkey"
FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reservations"
ADD CONSTRAINT "reservations_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reservations"
ADD CONSTRAINT "reservations_classroomId_fkey"
FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "occupancy"
ADD CONSTRAINT "occupancy_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "occupancy"
ADD CONSTRAINT "occupancy_classroomId_fkey"
FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notification"
ADD CONSTRAINT "notification_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notification"
ADD CONSTRAINT "notification_reservationId_fkey"
FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "profile"
ADD CONSTRAINT "profile_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;