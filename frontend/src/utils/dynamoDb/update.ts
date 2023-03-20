import { Cocktail, CocktailIngredient, CocktailTag, Ingredient, Tag } from '@/schema'
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
  TAG_PK,
  TAG_SK,
} from './constants'
import {
  getAllCocktailsForIngredient,
  getAllCocktailsForTag,
  getAllIngredientsForCocktail,
  getCocktail,
} from './get'

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

export async function putTag(tag: Tag) {
  const id = tag.id
  const PK = TAG_PK(id)
  const SK = TAG_SK

  const updatedItem: DbItem<Tag> = {
    id,
    PK,
    SK,
    'GSI-PK-1': SK,
    'GSI-SK-1': PK,
    lastUpdated: new Date().toISOString(),
    label: tag.label,
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

  updateCocktailsTags(tag)

  return updatedItem
}

export async function updateCocktailsTags(tag: Tag) {
  const lastUpdated = new Date().toISOString()

  try {
    const cocktailsForTag = await getAllCocktailsForTag(tag.id)

    // update joins

    const inputs: WriteRequest[] = cocktailsForTag.map((cocktailTag) => {
      const tagPK = TAG_PK(cocktailTag.tag.id)
      const cocktailPK = COCKTAIL_PK(cocktailTag.cocktail.id)

      const item: Omit<DbItem<CocktailTag>, 'id'> = {
        PK: cocktailPK,
        SK: tagPK,
        'GSI-PK-1': tagPK,
        'GSI-SK-1': cocktailPK,
        lastUpdated,
        cocktail: cocktailTag.cocktail,
        tag,
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
  } catch (e) {}
}

export async function putCocktailTags(
  cocktailId: string,
  tags: Tag[],
  removedTagsIds: string[] = []
) {
  const cocktailPK = COCKTAIL_PK(cocktailId)

  const cocktail = await getCocktail(cocktailId)

  if (!cocktail) {
    throw new Error('no cocktail')
  }

  const inputs: WriteRequest[] = tags
    .map((tag): WriteRequest[] => {
      const tagId = tag.id

      const tagPK = TAG_PK(tagId)

      const lastUpdated = new Date().toISOString()

      const tagItem: DbItem<Tag> = {
        id: tagId,
        PK: tagPK,
        SK: TAG_SK,
        'GSI-PK-1': TAG_SK,
        'GSI-SK-1': tagPK,
        lastUpdated,
        label: tag.label,
      }

      const cocktailTagItem: Omit<DbItem<CocktailTag>, 'id'> = {
        PK: cocktailPK,
        SK: tagPK,
        'GSI-PK-1': tagPK,
        'GSI-SK-1': cocktailPK,
        lastUpdated,
        cocktail,
        tag: tagItem,
      }

      return [tagItem, cocktailTagItem].map((item) => ({
        PutRequest: {
          Item: marshall(item, marshallOptions),
        },
      }))
    })
    .flat()

  const removeInputs: WriteRequest[] = removedTagsIds.map((tagId) => {
    const tagPK = TAG_PK(tagId)

    return {
      DeleteRequest: {
        Key: marshall({
          PK: cocktailPK,
          SK: tagPK,
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
