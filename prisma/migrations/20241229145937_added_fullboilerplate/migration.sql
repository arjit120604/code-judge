-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "fullBoilerplate" TEXT[] DEFAULT ARRAY[]::TEXT[];
