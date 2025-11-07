/*
  Warnings:

  - You are about to drop the `TourismPlace` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `TourismPlace` DROP FOREIGN KEY `TourismPlace_createdBy_fkey`;

-- DropTable
DROP TABLE `TourismPlace`;
