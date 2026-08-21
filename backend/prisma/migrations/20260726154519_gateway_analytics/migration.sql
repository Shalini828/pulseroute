/*
  Warnings:

  - Added the required column `endpoint` to the `GatewayRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "GatewayRequest" ADD COLUMN     "completionTokens" INTEGER,
ADD COLUMN     "endpoint" TEXT NOT NULL,
ADD COLUMN     "error" TEXT,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "promptTokens" INTEGER,
ADD COLUMN     "success" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "totalTokens" INTEGER;

-- CreateTable
CREATE TABLE "AsyncJob" (
    "id" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "prompt" TEXT NOT NULL,
    "provider" TEXT,
    "response" TEXT,
    "error" TEXT,
    "latency" INTEGER,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "totalTokens" INTEGER,
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AsyncJob_pkey" PRIMARY KEY ("id")
);
