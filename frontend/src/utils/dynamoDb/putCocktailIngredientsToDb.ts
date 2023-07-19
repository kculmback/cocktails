import { Cocktail, CocktailIngredient, Ingredient } from '@/schema'
import {
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  WriteRequest,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { chunk } from 'lodash-es'
import {
  COCKTAIL_PK,
  DbItem,
  INGREDIENT_PK,
  INGREDIENT_SK,
  dynamoDb,
  marshallOptions,
  tableName,
} from './constants'

export async function putCocktailIngredientsToDb(
  cocktail: Pick<Cocktail, 'id' | 'label'>,
  ingredients: (Ingredient & Pick<CocktailIngredient, 'amount'>)[],
  removedIngredientIds: string[] = []
) {
  const cocktailPK = COCKTAIL_PK(cocktail.id)

  const inputs: WriteRequest[] = ingredients
    .map(({ amount, ...ingredient }): WriteRequest[] => {
      const ingredientId = ingredient.id

      const ingredientPK = INGREDIENT_PK(ingredientId)

      const lastUpdated = new Date().toISOString()

      const ingredientItem: DbItem<Ingredient> = {
        id: ingredientId,
        PK: ingredientPK,
        SK: INGREDIENT_SK,
        'GSI-PK-1': INGREDIENT_SK,
        'GSI-SK-1': ingredientPK,
        lastUpdated,
        inStock: ingredient.inStock,
        label: ingredient.label,
        description: ingredient.description,
      }

      const cocktailIngredientItem: Omit<DbItem<CocktailIngredient>, 'id'> = {
        PK: cocktailPK,
        SK: ingredientPK,
        'GSI-PK-1': ingredientPK,
        'GSI-SK-1': cocktailPK,
        lastUpdated,
        cocktail,
        ingredient: ingredientItem,
        amount,
      }

      return [ingredientItem, cocktailIngredientItem].map((item) => ({
        PutRequest: {
          Item: marshall(item, marshallOptions),
        },
      }))
    })
    .flat()

  const removeInputs: WriteRequest[] = removedIngredientIds.map((ingredientId) => {
    const ingredientPK = INGREDIENT_PK(ingredientId)

    return {
      DeleteRequest: {
        Key: marshall({
          PK: cocktailPK,
          SK: ingredientPK,
        }),
      },
    }
  })

  const batches = chunk([...inputs, ...removeInputs], 25)

  await Promise.all(
    batches.map(async (batch) => {
      const batchCmd: BatchWriteItemCommandInput = {
        RequestItems: {
          [tableName]: batch,
        },
      }

      await dynamoDb.send(new BatchWriteItemCommand(batchCmd))
    })
  )
}
