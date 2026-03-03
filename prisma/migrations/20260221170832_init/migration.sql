/*
  Warnings:

  - The values [HOUSE,VILLA,CONDO] on the enum `Property_propertyType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `property` MODIFY `propertyType` ENUM('APARTMENT', 'INDEPENDENT') NOT NULL;
