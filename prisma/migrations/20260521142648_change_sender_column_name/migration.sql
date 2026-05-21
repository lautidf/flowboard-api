/*
  Warnings:

  - You are about to drop the column `sentById` on the `Invitation` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_sentById_fkey";

-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "sentById",
ADD COLUMN     "senderId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
