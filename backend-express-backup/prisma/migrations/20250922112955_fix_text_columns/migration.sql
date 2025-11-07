-- AlterTable
ALTER TABLE `ContactMessage` MODIFY `message` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `Doc` MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `News` MODIFY `content` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `TourismPlace` MODIFY `description` LONGTEXT NOT NULL;
