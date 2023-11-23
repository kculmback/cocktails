// import { Cocktail, Ingredient, IngredientsOnCocktails, Tag, TagsOnCocktails } from '@prisma/client'
// import { differenceBy } from 'lodash-es'
// import { SetOptional } from 'type-fest'
// import { prisma } from './prisma'

// type UpsertCocktailDbProps = {
//   cocktail: SetOptional<Cocktail, 'createdAt' | 'id' | 'updatedAt'>
//   ingredients: (SetOptional<Ingredient, 'createdAt' | 'updatedAt'> & { amount: string })[]
//   tags: SetOptional<Tag, 'createdAt' | 'updatedAt'>[]
// }

// export async function upsertCocktailDb({ cocktail, ingredients, tags }: UpsertCocktailDbProps) {
//   const dbCocktail = cocktail.id
//     ? await prisma.cocktail.update({
//         data: cocktail,
//         include: {
//           ingredients: { include: { ingredient: { include: { alternateIngredients: true } } } },
//           tags: { include: { tag: true } },
//         },
//         where: { id: cocktail.id },
//       })
//     : await prisma.cocktail.create({
//         data: cocktail,
//         include: {
//           ingredients: { include: { ingredient: { include: { alternateIngredients: true } } } },
//           tags: { include: { tag: true } },
//         },
//       })

//   const [dbIngredients, dbTags] = await Promise.all([
//     updateCocktailIngredients({ cocktail: dbCocktail, ingredients }),
//     updateCocktailTags({ cocktail: dbCocktail, tags }),
//   ])

//   return { ...dbCocktail, ingredients: dbIngredients, tags: dbTags }
// }

// type UpdateCocktailIngredientsProps = {
//   cocktail: Cocktail & { ingredients: IngredientsOnCocktails[] }
// } & Pick<UpsertCocktailDbProps, 'ingredients'>

// async function updateCocktailIngredients({
//   cocktail,
//   ingredients,
// }: UpdateCocktailIngredientsProps) {
//   const removedIngredients = differenceBy(cocktail.ingredients, ingredients, (value) =>
//     'ingredientId' in value ? value.ingredientId : value.id
//   )

//   const deletes = Promise.all(
//     removedIngredients.map(async (ingredient) => {
//       return prisma.ingredientsOnCocktails.delete({
//         where: {
//           cocktailId_ingredientId: {
//             cocktailId: cocktail.id,
//             ingredientId: ingredient.ingredientId,
//           },
//         },
//       })
//     })
//   )

//   const upserts = Promise.all(
//     ingredients.map(async (ingredient) => {
//       const ingredientOnCocktail: IngredientsOnCocktails = {
//         amount: ingredient.amount,
//         cocktailId: cocktail.id,
//         ingredientId: ingredient.id,
//       }
//       return prisma.ingredientsOnCocktails.upsert({
//         create: ingredientOnCocktail,
//         update: ingredientOnCocktail,
//         where: {
//           cocktailId_ingredientId: {
//             cocktailId: ingredientOnCocktail.cocktailId,
//             ingredientId: ingredientOnCocktail.ingredientId,
//           },
//         },
//         include: {
//           ingredient: { include: { alternateIngredients: true } },
//         },
//       })
//     })
//   )

//   const [__, dbIngredients] = await Promise.all([deletes, upserts])

//   return dbIngredients
// }

// type UpdateCocktailTagsProps = {
//   cocktail: Cocktail & { tags: TagsOnCocktails[] }
// } & Pick<UpsertCocktailDbProps, 'tags'>

// async function updateCocktailTags({ cocktail, tags }: UpdateCocktailTagsProps) {
//   const removedTags = differenceBy(cocktail.tags, tags, (value) =>
//     'tagId' in value ? value.tagId : value.id
//   )

//   const deletes = Promise.all(
//     removedTags.map(async (tag) => {
//       return prisma.tagsOnCocktails.delete({
//         where: {
//           cocktailId_tagId: {
//             cocktailId: cocktail.id,
//             tagId: tag.tagId,
//           },
//         },
//       })
//     })
//   )

//   const upserts = Promise.all(
//     tags.map(async (tag) => {
//       const tagOnCocktail: TagsOnCocktails = {
//         cocktailId: cocktail.id,
//         tagId: tag.id,
//       }
//       return prisma.tagsOnCocktails.upsert({
//         create: tagOnCocktail,
//         update: tagOnCocktail,
//         where: {
//           cocktailId_tagId: {
//             cocktailId: tagOnCocktail.cocktailId,
//             tagId: tagOnCocktail.tagId,
//           },
//         },
//         include: {
//           tag: true,
//         },
//       })
//     })
//   )

//   const [__, dbTags] = await Promise.all([deletes, upserts])

//   return dbTags
// }
