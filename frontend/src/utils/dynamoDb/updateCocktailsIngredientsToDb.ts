import { CocktailIngredient, Ingredient } from '@/schema'
import {
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  UpdateItemCommand,
  UpdateItemInput,
  WriteRequest,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { chunk } from 'lodash-es'
import {
  COCKTAIL_PK,
  COCKTAIL_SK,
  DbItem,
  INGREDIENT_PK,
  dynamoDb,
  marshallOptions,
  tableName,
} from './constants'
import { getAllCocktailsForIngredientFromDb } from './getAllCocktailsForIngredientFromDb'
import { getAllIngredientsForCocktailFromDb } from './getAllIngredientsForCocktailFromDb'

export async function updateCocktailsIngredientsToDb(ingredient: Ingredient) {
  const lastUpdated = new Date().toISOString()

  try {
    const cocktailsForIngredient = await getAllCocktailsForIngredientFromDb(ingredient.id)

    // update joins

    const inputs: WriteRequest[] = cocktailsForIngredient.map((cocktailIngredient) => {
      const ingredientPK = INGREDIENT_PK(cocktailIngredient.ingredient.id)
      const cocktailPK = COCKTAIL_PK(cocktailIngredient.cocktail.id)

      const item: Omit<DbItem<CocktailIngredient>, 'id'> = {
        PK: cocktailPK,
        SK: ingredientPK,
        'GSI-PK-1': ingredientPK,
        'GSI-SK-1': cocktailPK,
        lastUpdated,
        cocktail: cocktailIngredient.cocktail,
        ingredient,
        amount: cocktailIngredient.amount,
      }

      return {
        PutRequest: {
          Item: marshall(item, marshallOptions),
        },
      }
    })

    const batches = chunk(inputs, 25)

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

    // update cocktails

    await Promise.all(
      cocktailsForIngredient.map(async (cocktailIngredient) => {
        const allIngredientsForCocktail = await getAllIngredientsForCocktailFromDb(
          cocktailIngredient.cocktail.id
        )

        const updateInput: UpdateItemInput = {
          TableName: tableName,
          Key: marshall({
            PK: COCKTAIL_PK(cocktailIngredient.cocktail.id),
            SK: COCKTAIL_SK,
          }),
          UpdateExpression: 'SET #inStock = :inStock',
          ExpressionAttributeNames: {
            '#inStock': 'inStock',
          },
          ExpressionAttributeValues: marshall({
            ':inStock': allIngredientsForCocktail.every(({ ingredient }) => ingredient.inStock),
          }),
        }

        await dynamoDb.send(new UpdateItemCommand(updateInput))
      })
    )
  } catch (e) {}
}
