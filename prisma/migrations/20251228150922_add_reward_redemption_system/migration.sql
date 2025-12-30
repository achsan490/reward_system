-- CreateTable
CREATE TABLE `reward_catalog` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `pointsRequired` DOUBLE NOT NULL,
    `stock` INTEGER NULL,
    `imageUrl` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `validUntil` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reward_redemptions` (
    `id` VARCHAR(191) NOT NULL,
    `memberId` VARCHAR(191) NOT NULL,
    `catalogId` VARCHAR(191) NOT NULL,
    `pointsUsed` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `notes` TEXT NULL,
    `adminNotes` TEXT NULL,
    `redeemedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processedAt` DATETIME(3) NULL,
    `processedBy` VARCHAR(191) NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `reward_redemptions_memberId_idx`(`memberId`),
    INDEX `reward_redemptions_catalogId_idx`(`catalogId`),
    INDEX `reward_redemptions_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reward_redemptions` ADD CONSTRAINT `reward_redemptions_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reward_redemptions` ADD CONSTRAINT `reward_redemptions_catalogId_fkey` FOREIGN KEY (`catalogId`) REFERENCES `reward_catalog`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
