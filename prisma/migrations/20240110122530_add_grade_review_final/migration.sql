/*
  Warnings:

  - You are about to alter the column `currentGrade` on the `GradeReview` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `expectedGrade` on the `GradeReview` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `GradeReview` MODIFY `currentGrade` DOUBLE NOT NULL,
    MODIFY `expectedGrade` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `GradeReviewFinal` (
    `reviewerId` VARCHAR(191) NOT NULL,
    `gradeReviewId` VARCHAR(191) NOT NULL,
    `finalGrade` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`reviewerId`, `gradeReviewId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GradeReviewFinal` ADD CONSTRAINT `GradeReviewFinal_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GradeReviewFinal` ADD CONSTRAINT `GradeReviewFinal_gradeReviewId_fkey` FOREIGN KEY (`gradeReviewId`) REFERENCES `GradeReview`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
