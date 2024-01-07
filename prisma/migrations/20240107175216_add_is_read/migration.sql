/*
  Warnings:

  - You are about to drop the column `isRead` on the `GradeReview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `GradeReview` DROP COLUMN `isRead`;

-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `isRead` BOOLEAN NOT NULL DEFAULT false;
