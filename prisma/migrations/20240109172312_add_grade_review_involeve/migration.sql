-- AlterTable
ALTER TABLE `GradeReview` ADD COLUMN `gradeName` VARCHAR(191) NULL DEFAULT 'Grade',
    ADD COLUMN `percentage` INTEGER NULL DEFAULT 0;
