-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "rating" SET DEFAULT 5;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "image" TEXT NOT NULL DEFAULT 'null';
