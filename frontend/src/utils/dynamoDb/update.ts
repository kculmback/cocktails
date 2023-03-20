import { Cocktail, CocktailIngredient, Ingredient } from '@/schema'
import {
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
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
  dynamoDb,
  INGREDIENT_PK,
  INGREDIENT_SK,
  marshallOptions,
  tableName,
} from './constants'
import { getAllCocktailsForIngredient, getAllIngredientsForCocktail } from './get'

export async function putCocktail(cocktail: Cocktail) {
  const id = cocktail.id
  const PK = COCKTAIL_PK(id)
  const SK = COCKTAIL_SK

  const updatedItem: DbItem<Cocktail> = {
    id,
    PK,
    SK,
    'GSI-PK-1': SK,
    'GSI-SK-1': PK,
    lastUpdated: new Date().toISOString(),
    label: cocktail.label,
    url: cocktail.url,
    steps: cocktail.steps,
    inStock: cocktail.inStock,
    description: cocktail.description,
    image: cocktail.image,
  }

  const input: PutItemCommandInput = {
    Item: marshall(updatedItem, marshallOptions),
    TableName: tableName,
  }

  const result = await dynamoDb.send(new PutItemCommand(input))

  const statusCode = result?.$metadata?.httpStatusCode ?? 0

  if (statusCode / 100 > 2) {
    throw new Error('Invalid')
  }

  return updatedItem
}

export async function putIngredient(ingredient: Ingredient) {
  const id = ingredient.id
  const PK = INGREDIENT_PK(id)
  const SK = INGREDIENT_SK

  const updatedItem: DbItem<Ingredient> = {
    id,
    PK,
    SK,
    'GSI-PK-1': SK,
    'GSI-SK-1': PK,
    lastUpdated: new Date().toISOString(),
    inStock: ingredient.inStock,
    label: ingredient.label,
    description: ingredient.description,
  }

  const input: PutItemCommandInput = {
    Item: marshall(updatedItem, marshallOptions),
    TableName: tableName,
  }

  const result = await dynamoDb.send(new PutItemCommand(input))

  const statusCode = result?.$metadata?.httpStatusCode ?? 0

  if (statusCode / 100 > 2) {
    throw new Error('Invalid')
  }

  updateCocktailsIngredients(ingredient)

  return updatedItem
}

export async function updateCocktailsIngredients(ingredient: Ingredient) {
  const lastUpdated = new Date().toISOString()

  try {
    const cocktailsForIngredient = await getAllCocktailsForIngredient(ingredient.id)

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
        ingredient: cocktailIngredient.ingredient,
        // cocktailId: cocktailIngredient.cocktailId,
        // cocktailLabel: cocktailIngredient.cocktailLabel,
        // ingredientId: cocktailIngredient.ingredientId,
        // ingredientLabel: ingredient.label,
        // inStock: ingredient.inStock,
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
        const allIngredientsForCocktail = await getAllIngredientsForCocktail(
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

export async function putCocktailIngredients(
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
        // cocktailId: cocktail.id,
        // cocktailLabel: cocktail.label,
        // ingredientId: ingredientItem.id,
        // ingredientLabel: ingredientItem.label,
        // inStock: ingredientItem.inStock,
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
