/*
  Warnings:

  - You are about to alter the column `jobType` on the `Application` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `status` on the `Application` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `Application` MODIFY `jobType` ENUM('FULLTIME', 'PARTTIME', 'INTERNSHIP', 'CONTRACT', 'FREELANCE') NOT NULL,
    MODIFY `status` ENUM('APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN') NOT NULL DEFAULT 'APPLIED',
    MODIFY `jobUrl` TEXT NULL;
