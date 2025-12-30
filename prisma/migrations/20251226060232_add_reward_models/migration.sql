-- CreateTable
CREATE TABLE `reward_campaigns` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `criteria` VARCHAR(191) NOT NULL,
    `winnersCount` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reward_winners` (
    `id` VARCHAR(191) NOT NULL,
    `campaignId` VARCHAR(191) NOT NULL,
    `memberId` VARCHAR(191) NOT NULL,
    `rank` INTEGER NOT NULL,
    `pointsAtWin` DOUBLE NOT NULL,
    `spentAtWin` DOUBLE NOT NULL,
    `transactionsAtWin` INTEGER NOT NULL,
    `rewardClaimed` BOOLEAN NOT NULL DEFAULT false,
    `claimedAt` DATETIME(3) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `reward_winners_campaignId_idx`(`campaignId`),
    INDEX `reward_winners_memberId_idx`(`memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reward_winners` ADD CONSTRAINT `reward_winners_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `reward_campaigns`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reward_winners` ADD CONSTRAINT `reward_winners_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
