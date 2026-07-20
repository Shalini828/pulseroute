/*
  Warnings:

  - Added the required column `projectId` to the `GatewayRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GatewayRequest" DROP CONSTRAINT "GatewayRequest_userId_fkey";

-- AlterTable
ALTER TABLE "GatewayRequest" ADD COLUMN     "projectId" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "GatewayRequest" ADD CONSTRAINT "GatewayRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GatewayRequest" ADD CONSTRAINT "GatewayRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
