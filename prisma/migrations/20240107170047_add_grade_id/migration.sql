/*
  Warnings:

  - Added the required column `gradeId` to the `GradeReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GradeReview` ADD COLUMN `gradeId` VARCHAR(191) NOT NULL;
