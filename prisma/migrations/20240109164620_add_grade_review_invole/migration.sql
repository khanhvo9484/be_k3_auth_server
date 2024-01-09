-- CreateTable
CREATE TABLE `GradeReviewInvolve` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `gradeReviewId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GradeReviewInvolve` ADD CONSTRAINT `GradeReviewInvolve_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GradeReviewInvolve` ADD CONSTRAINT `GradeReviewInvolve_gradeReviewId_fkey` FOREIGN KEY (`gradeReviewId`) REFERENCES `GradeReview`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
