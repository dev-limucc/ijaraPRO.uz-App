/*
  Warnings:

  - Added the required column `currency` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('UZ', 'RU', 'EN');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('UZS', 'USD', 'EUR');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "currency" "Currency" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'UZS',
ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'UZ';
