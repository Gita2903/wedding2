-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `weddingId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wedding` (
    `id` VARCHAR(191) NOT NULL,
    `groomName` VARCHAR(191) NOT NULL,
    `brideName` VARCHAR(191) NOT NULL,
    `weddingDate` DATETIME(3) NULL,
    `estimatedBudget` DOUBLE NOT NULL DEFAULT 0,
    `estimatedGuests` INTEGER NOT NULL DEFAULT 0,
    `city` VARCHAR(191) NOT NULL DEFAULT '',
    `religion` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `phase` VARCHAR(191) NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `weddingId` VARCHAR(191) NOT NULL,
    `lastEditedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vendor` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL DEFAULT '',
    `priceQuote` DOUBLE NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL,
    `notes` TEXT NOT NULL,
    `weddingId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `note` VARCHAR(191) NOT NULL DEFAULT '',
    `vendorId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentItem` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `deadline` DATETIME(3) NOT NULL,
    `weddingId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_weddingId_fkey` FOREIGN KEY (`weddingId`) REFERENCES `Wedding`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_weddingId_fkey` FOREIGN KEY (`weddingId`) REFERENCES `Wedding`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_lastEditedById_fkey` FOREIGN KEY (`lastEditedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vendor` ADD CONSTRAINT `Vendor_weddingId_fkey` FOREIGN KEY (`weddingId`) REFERENCES `Wedding`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentItem` ADD CONSTRAINT `DocumentItem_weddingId_fkey` FOREIGN KEY (`weddingId`) REFERENCES `Wedding`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
