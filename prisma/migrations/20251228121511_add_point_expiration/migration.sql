-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `pointsExpired` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pointsExpiryDate` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `transactions_pointsExpiryDate_idx` ON `transactions`(`pointsExpiryDate`);
