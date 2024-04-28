-- CreateTable
CREATE TABLE `UserAccount` (
    `UUID_UA` VARCHAR(191) NOT NULL,
    `Name_UA` VARCHAR(191) NOT NULL,
    `Email_UA` VARCHAR(191) NOT NULL,
    `Password_UA` VARCHAR(191) NOT NULL,
    `Phone_UA` VARCHAR(191) NOT NULL,
    `Address_UA` VARCHAR(191) NULL,
    `Birthplace_UA` VARCHAR(191) NULL,
    `Birthdate_UA` DATETIME(3) NULL,
    `Photo_UA` VARCHAR(191) NULL,
    `isAdmin_UA` BOOLEAN NOT NULL DEFAULT false,
    `isUser_UA` BOOLEAN NOT NULL DEFAULT true,
    `isSuperAdmin_UA` BOOLEAN NOT NULL DEFAULT false,
    `isActive_UA` BOOLEAN NOT NULL DEFAULT true,
    `LastLogin_UA` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserAccount_Email_UA_key`(`Email_UA`),
    PRIMARY KEY (`UUID_UA`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
