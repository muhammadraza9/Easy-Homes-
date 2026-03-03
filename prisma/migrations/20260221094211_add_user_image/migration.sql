-- AlterTable
ALTER TABLE `property` MODIFY `propertyType` ENUM('APARTMENT', 'HOUSE', 'VILLA', 'CONDO', 'INDEPENDENT') NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `image` VARCHAR(191) NULL;
