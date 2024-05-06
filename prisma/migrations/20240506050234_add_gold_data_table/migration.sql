/*
  Warnings:

  - You are about to alter the column `Sell_GD` on the `GoldData` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `Buy_GD` on the `GoldData` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `GoldData` MODIFY `Sell_GD` DOUBLE NOT NULL,
    MODIFY `Buy_GD` DOUBLE NOT NULL;
