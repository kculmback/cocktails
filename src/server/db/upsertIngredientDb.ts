// import { Ingredient } from '@prisma/client'
// import { SetOptional } from 'type-fest'
// import { prisma } from './prisma'
// import { differenceBy } from 'lodash-es'

// type UpsertIngredientDbProps = {
//   ingredient: SetOptional<Ingredient, 'createdAt' | 'id' | 'updatedAt'>
//   alternateIngredientsIds: Ingredient['id'][]
// }

// export async function upsertIngredientDb({
//   alternateIngredientsIds,
//   ingredient,
// }: UpsertIngredientDbProps) {
//   const dbIngredient = ingredient.id
//     ? await prisma.ingredient.update({
//         data: ingredient,
//         where: { id: ingredient.id },
//         include: { alternateIngredients: true },
//       })
//     : await prisma.ingredient.create({
//         data: ingredient,
//         include: { alternateIngredients: true },
//       })

//   await updateAlternateIngredients({
//     ingredient: dbIngredient,
//     alternateIngredientsIds,
//   })

//   return dbIngredient
// }

// type UpdateAlternateIngredientsProps = {
//   ingredient: Ingredient & { alternateIngredients: Ingredient[] }
// } & Pick<UpsertIngredientDbProps, 'alternateIngredientsIds'>

// async function updateAlternateIngredients({
//   alternateIngredientsIds,
//   ingredient: mainIngredient,
// }: UpdateAlternateIngredientsProps) {
//   const removedAlternateIngredients = differenceBy(
//     mainIngredient.alternateIngredients,
//     alternateIngredientsIds,
//     (value) => (typeof value === 'string' ? value : value.id)
//   )

//   await prisma.ingredient.update({
//     where: { id: mainIngredient.id },
//     data: {
//       alternateIngredients: {
//         connect: alternateIngredientsIds.map((id) => ({ id })),
//         disconnect: removedAlternateIngredients.map(({ id }) => ({ id })),
//       },
//     },
//   })
// }
