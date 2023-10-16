/*
  Warnings:

  - The values [CANCELLLED] on the enum `BOOKING_STATUS` will be removed. If these variants are still used in the database, this will fail.
  - The values [CANCELLLED] on the enum `ISSUE_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BOOKING_STATUS_new" AS ENUM ('PENDING', 'CONFIRM', 'CANCELLED');
ALTER TABLE "bookings" ALTER COLUMN "bookingStatus" DROP DEFAULT;
ALTER TABLE "bookings" ALTER COLUMN "bookingStatus" TYPE "BOOKING_STATUS_new" USING ("bookingStatus"::text::"BOOKING_STATUS_new");
ALTER TYPE "BOOKING_STATUS" RENAME TO "BOOKING_STATUS_old";
ALTER TYPE "BOOKING_STATUS_new" RENAME TO "BOOKING_STATUS";
DROP TYPE "BOOKING_STATUS_old";
ALTER TABLE "bookings" ALTER COLUMN "bookingStatus" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ISSUE_STATUS_new" AS ENUM ('PENDING', 'ONGOING', 'FIXED', 'NOT_FIXED', 'CANCELLED');
ALTER TABLE "bookings" ALTER COLUMN "issueStatus" DROP DEFAULT;
ALTER TABLE "bookings" ALTER COLUMN "issueStatus" TYPE "ISSUE_STATUS_new" USING ("issueStatus"::text::"ISSUE_STATUS_new");
ALTER TYPE "ISSUE_STATUS" RENAME TO "ISSUE_STATUS_old";
ALTER TYPE "ISSUE_STATUS_new" RENAME TO "ISSUE_STATUS";
DROP TYPE "ISSUE_STATUS_old";
ALTER TABLE "bookings" ALTER COLUMN "issueStatus" SET DEFAULT 'PENDING';
COMMIT;
