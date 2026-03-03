/*
  Warnings:

  - The primary key for the `image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `property` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updatedAt` on the `property` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `property` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `bhk` on the `property` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(2))`.
  - You are about to alter the column `parking` on the `property` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(3))`.
  - The values [BACHELORS] on the enum `Property_preferredTenants` will be removed. If these variants are still used in the database, this will fail.
  - The values [INDEPENENT] on the enum `Property_propertyType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `Image_propertyId_fkey`;

-- DropForeignKey
ALTER TABLE `property` DROP FOREIGN KEY `Property_ownerId_fkey`;

-- AlterTable
ALTER TABLE `image` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `propertyId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `property` DROP PRIMARY KEY,
    DROP COLUMN `updatedAt`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `description` TEXT NOT NULL,
    MODIFY `type` ENUM('RENT', 'SALE') NOT NULL,
    MODIFY `bhk` ENUM('ONE_BHK', 'TWO_BHK', 'THREE_BHK', 'FOUR_BHK') NOT NULL,
    MODIFY `parking` ENUM('YES', 'NO') NOT NULL,
    MODIFY `preferredTenants` ENUM('FAMILY', 'BACHELOR', 'ANY') NOT NULL,
    MODIFY `propertyType` ENUM('APARTMENT', 'HOUSE', 'VILLA', 'CONDO') NOT NULL,
    MODIFY `ownerId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Property` ADD CONSTRAINT `Property_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
