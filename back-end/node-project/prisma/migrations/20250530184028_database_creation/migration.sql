-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('CONCLUIDO', 'EM_ANDAMENTO', 'A_FAZER');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'A_FAZER';
