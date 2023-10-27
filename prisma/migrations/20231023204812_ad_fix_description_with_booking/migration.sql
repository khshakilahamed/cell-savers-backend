-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "fix_descritpion" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "profile_picture" SET DEFAULT 'null';
