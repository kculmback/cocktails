/*
  Warnings:

  - Added the required column `inStock` to the `Cocktail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cocktail" ADD COLUMN     "inStock" BOOLEAN NOT NULL;
