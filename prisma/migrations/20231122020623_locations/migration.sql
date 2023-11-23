/*
  Warnings:

  - You are about to drop the `TagsOnCocktails` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `locationId` to the `Cocktail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TagsOnCocktails" DROP CONSTRAINT "TagsOnCocktails_cocktailId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnCocktails" DROP CONSTRAINT "TagsOnCocktails_tagId_fkey";

-- AlterTable
ALTER TABLE "Cocktail" ADD COLUMN     "locationId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "locationId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "locationId" UUID NOT NULL;

-- DropTable
DROP TABLE "TagsOnCocktails";

-- CreateTable
CREATE TABLE "Location" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invitationCode" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LocationToUser" (
    "A" UUID NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CocktailToTag" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LocationToUser_AB_unique" ON "_LocationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationToUser_B_index" ON "_LocationToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CocktailToTag_AB_unique" ON "_CocktailToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CocktailToTag_B_index" ON "_CocktailToTag"("B");

-- AddForeignKey
ALTER TABLE "Cocktail" ADD CONSTRAINT "Cocktail_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToUser" ADD CONSTRAINT "_LocationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToUser" ADD CONSTRAINT "_LocationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CocktailToTag" ADD CONSTRAINT "_CocktailToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Cocktail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CocktailToTag" ADD CONSTRAINT "_CocktailToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
