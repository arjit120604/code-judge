-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "boilerplate" TEXT[] DEFAULT ARRAY[]::TEXT[];
