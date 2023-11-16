/*
  Warnings:

  - You are about to drop the `AlternateIngredients` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AlternateIngredients" DROP CONSTRAINT "AlternateIngredients_alternateIngredientId_fkey";

-- DropForeignKey
ALTER TABLE "AlternateIngredients" DROP CONSTRAINT "AlternateIngredients_mainIngredientId_fkey";

-- DropTable
DROP TABLE "AlternateIngredients";

-- CreateTable
CREATE TABLE "_AlternateIngredients" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AlternateIngredients_AB_unique" ON "_AlternateIngredients"("A", "B");

-- CreateIndex
CREATE INDEX "_AlternateIngredients_B_index" ON "_AlternateIngredients"("B");

-- AddForeignKey
ALTER TABLE "_AlternateIngredients" ADD CONSTRAINT "_AlternateIngredients_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlternateIngredients" ADD CONSTRAINT "_AlternateIngredients_B_fkey" FOREIGN KEY ("B") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
