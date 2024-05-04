/*
  Warnings:

  - Added the required column `Filename_CD` to the `ContentData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ContentData` ADD COLUMN `Filename_CD` VARCHAR(191) NOT NULL;
