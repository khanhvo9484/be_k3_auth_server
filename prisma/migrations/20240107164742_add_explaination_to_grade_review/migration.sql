/*
  Warnings:

  - You are about to drop the column `explanation` on the `GradeReview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `GradeReview` DROP COLUMN `explanation`,
    ADD COLUMN `explaination` VARCHAR(191) NULL;
