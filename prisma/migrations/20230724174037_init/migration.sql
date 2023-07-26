-- CreateTable
CREATE TABLE "Cocktail" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT,
    "image" TEXT,
    "description" TEXT,
    "instructions" TEXT,

    CONSTRAINT "Cocktail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "inStock" BOOLEAN NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlternateIngredients" (
    "mainIngredientId" UUID NOT NULL,
    "alternateIngredientId" UUID NOT NULL,

    CONSTRAINT "AlternateIngredients_pkey" PRIMARY KEY ("mainIngredientId","alternateIngredientId")
);

-- CreateTable
CREATE TABLE "IngredientsOnCocktails" (
    "cocktailId" UUID NOT NULL,
    "ingredientId" UUID NOT NULL,
    "amount" TEXT NOT NULL,

    CONSTRAINT "IngredientsOnCocktails_pkey" PRIMARY KEY ("cocktailId","ingredientId")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnCocktails" (
    "cocktailId" UUID NOT NULL,
    "tagId" UUID NOT NULL,

    CONSTRAINT "TagsOnCocktails_pkey" PRIMARY KEY ("cocktailId","tagId")
);

-- AddForeignKey
ALTER TABLE "AlternateIngredients" ADD CONSTRAINT "AlternateIngredients_mainIngredientId_fkey" FOREIGN KEY ("mainIngredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlternateIngredients" ADD CONSTRAINT "AlternateIngredients_alternateIngredientId_fkey" FOREIGN KEY ("alternateIngredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientsOnCocktails" ADD CONSTRAINT "IngredientsOnCocktails_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES "Cocktail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientsOnCocktails" ADD CONSTRAINT "IngredientsOnCocktails_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnCocktails" ADD CONSTRAINT "TagsOnCocktails_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES "Cocktail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnCocktails" ADD CONSTRAINT "TagsOnCocktails_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
