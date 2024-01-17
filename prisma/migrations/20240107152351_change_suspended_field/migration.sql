/*
  Warnings:

  - You are about to drop the column `isSuspensed` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `isSuspensed`,
    ADD COLUMN `isSuspended` BOOLEAN NOT NULL DEFAULT false;
