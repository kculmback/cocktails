import { Cocktail, CocktailIngredient, Ingredient } from '@/schema'
import {
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateItemCommand,
  UpdateItemInput,
  WriteRequest,
} from '@aws-sdk/client-dynamodb'
import { marshall, marshallOptions as MarshallOptions, unmarshall } from '@aws-sdk/util-dynamodb'
import { chunk } from 'lodash-es'

const tableName = process.env.TABLE_NAME ?? ''
const marshallOptions: MarshallOptions = {
  convertEmptyValues: true,
  removeUndefinedValues: true,
}

const COCKTAIL_PK = (id: string) => `${COCKTAIL_SK}#${id}`
const COCKTAIL_SK = 'COCKTAIL'

const INGREDIENT_PK = (id: string) => `${INGREDIENT_SK}#${id}`
const INGREDIENT_SK = 'INGREDIENT'

export const dynamoDb = new DynamoDBClient({ region: process.env.REGION })

type DbItem<T> = Omit<T, 'id'> & {
  id: string
  PK: string
  SK: string
  'GSI-PK-1': string
  'GSI-SK-1': string
  lastUpdated: string
}

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
    link: cocktail.link,
    steps: cocktail.steps,
    inStock: cocktail.inStock,
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
      const ingredientPK = INGREDIENT_PK(cocktailIngredient.ingredientId)
      const cocktailPK = COCKTAIL_PK(cocktailIngredient.cocktailId)

      const item: Omit<DbItem<CocktailIngredient>, 'id'> = {
        PK: cocktailPK,
        SK: ingredientPK,
        'GSI-PK-1': ingredientPK,
        'GSI-SK-1': cocktailPK,
        lastUpdated,
        cocktailId: cocktailIngredient.cocktailId,
        cocktailLabel: cocktailIngredient.cocktailLabel,
        ingredientId: cocktailIngredient.ingredientId,
        ingredientLabel: ingredient.label,
        inStock: ingredient.inStock,
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
          cocktailIngredient.cocktailId
        )

        const updateInput: UpdateItemInput = {
          TableName: tableName,
          Key: marshall({
            PK: COCKTAIL_PK(cocktailIngredient.cocktailId),
            SK: COCKTAIL_SK,
          }),
          UpdateExpression: 'SET #inStock = :inStock',
          ExpressionAttributeNames: {
            '#inStock': 'inStock',
          },
          ExpressionAttributeValues: marshall({
            ':inStock': allIngredientsForCocktail.every(({ inStock }) => inStock),
          }),
        }

        await dynamoDb.send(new UpdateItemCommand(updateInput))
      })
    )
  } catch (e) {}
}

export async function putCocktailIngredients(
  cocktail: Pick<Cocktail, 'id' | 'label'>,
  ingredients: (Ingredient & Pick<CocktailIngredient, 'amount'>)[]
) {
  const inputs: WriteRequest[] = ingredients
    .map(({ amount, ...ingredient }): WriteRequest[] => {
      const ingredientId = ingredient.id

      const ingredientPK = INGREDIENT_PK(ingredientId)
      const cocktailPK = COCKTAIL_PK(cocktail.id)

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
        cocktailId: cocktail.id,
        cocktailLabel: cocktail.label,
        ingredientId: ingredientItem.id,
        ingredientLabel: ingredientItem.label,
        inStock: ingredientItem.inStock,
        amount,
      }

      return [ingredientItem, cocktailIngredientItem].map((item) => ({
        PutRequest: {
          Item: marshall(item, marshallOptions),
        },
      }))
    })
    .flat()

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
}

export async function getAllCocktails(filter?: 'all' | 'available' | 'not-available') {
  const input: QueryCommandInput = {
    TableName: tableName,
    IndexName: 'GSI1',
    KeyConditionExpression: '#pk = :cocktailPartitionKey and begins_with(#sk, :sk)',
    FilterExpression: !filter || filter === 'all' ? undefined : '#inStock = :inStock',
    ExpressionAttributeNames: {
      '#pk': 'GSI-PK-1',
      '#sk': 'GSI-SK-1',
      '#inStock': 'inStock',
    },
    ExpressionAttributeValues: marshall({
      ':cocktailPartitionKey': COCKTAIL_SK,
      ':sk': COCKTAIL_SK,
      ':inStock': filter === 'available',
    }),
  }

  const result = await dynamoDb.send(new QueryCommand(input))

  const statusCode = result?.$metadata?.httpStatusCode ?? 0

  if (statusCode / 100 > 2 || !result.Items) {
    throw new Error('Invalid')
  }

  const parsedResultItems = result.Items?.map((item) => unmarshall(item) as Cocktail)

  return parsedResultItems
}

export async function getInStockCocktails() {
  const input: QueryCommandInput = {
    TableName: tableName,
    IndexName: 'GSI1',
    KeyConditionExpression: '#pk = :cocktailPartitionKey and begins_with(#sk, :sk)',
    FilterExpression: '#inStock = :inStock',
    ExpressionAttributeNames: {
      '#pk': 'GSI-PK-1',
      '#sk': 'GSI-SK-1',
      '#inStock': 'inStock',
    },
    ExpressionAttributeValues: marshall({
      ':cocktailPartitionKey': COCKTAIL_SK,
      ':sk': COCKTAIL_SK,
      ':inStock': true,
    }),
  }

  const result = await dynamoDb.send(new QueryCommand(input))

  const statusCode = result?.$metadata?.httpStatusCode ?? 0

  if (statusCode / 100 > 2 || !result.Items) {
    throw new Error('Invalid')
  }

  const parsedResultItems = result.Items?.map((item) => unmarshall(item) as Cocktail)

  return parsedResultItems
}

export async function getAllIngredients() {
  const input: QueryCommandInput = {
    TableName: tableName,
    IndexName: 'GSI1',
    KeyConditionExpression: '#pk = :ingredientPartitionKey and begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#pk': 'GSI-PK-1',
      '#sk': 'GSI-SK-1',
    },
    ExpressionAttributeValues: marshall({
      ':ingredientPartitionKey': INGREDIENT_SK,
      ':sk': INGREDIENT_SK,
    }),
  }

  const result = await dynamoDb.send(new QueryCommand(input))

  const statusCode = result?.$metadata?.httpStatusCode ?? 0

  if (statusCode / 100 > 2 || !result.Items) {
    throw new Error('Invalid')
  }

  const parsedResultItems = result.Items?.map((item) => unmarshall(item) as Ingredient)

  return parsedResultItems
}

export async function getAllIngredientsForCocktail(cocktailId: string) {
  const input: QueryCommandInput = {
    TableName: tableName,
    KeyConditionExpression: '#pk = :cocktailPartitionKey and begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#pk': 'PK',
      '#sk': 'SK',
    },
    ExpressionAttributeValues: marshall({
      ':cocktailPartitionKey': COCKTAIL_PK(cocktailId),
      ':sk': INGREDIENT_SK,
    }),
  }

  const result = await dynamoDb.send(new QueryCommand(input))

  const statusCode = result?.$metadata?.httpStatusCode ?? 0

  if (statusCode / 100 > 2 || !result.Items) {
    throw new Error('Invalid')
  }

  const parsedResultItems = result.Items?.map((item) => unmarshall(item) as CocktailIngredient)

  return parsedResultItems
}

export async function getAllCocktailsForIngredient(ingredientId: string) {
  const input: QueryCommandInput = {
    TableName: tableName,
    IndexName: 'GSI1',
    KeyConditionExpression: '#pk = :ingredientPartitionKey and begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#pk': 'GSI-PK-1',
      '#sk': 'GSI-SK-1',
    },
    ExpressionAttributeValues: marshall({
      ':ingredientPartitionKey': INGREDIENT_PK(ingredientId),
      ':sk': COCKTAIL_SK,
    }),
  }

  const result = await dynamoDb.send(new QueryCommand(input))

  const statusCode = result?.$metadata?.httpStatusCode ?? 0

  if (statusCode / 100 > 2 || !result.Items) {
    throw new Error('Invalid')
  }

  const parsedResultItems = result.Items?.map((item) => unmarshall(item) as CocktailIngredient)

  return parsedResultItems
}

export async function getCocktail(cocktailId: string) {
  const input: GetItemCommandInput = {
    TableName: tableName,
    Key: marshall({
      PK: COCKTAIL_PK(cocktailId),
      SK: COCKTAIL_SK,
    }),
  }

  const results = await dynamoDb.send(new GetItemCommand(input))

  if (!results.Item) return

  const item = unmarshall(results.Item) as DbItem<Cocktail>

  return item
}

export async function getIngredient(ingredientId: string) {
  const input: GetItemCommandInput = {
    TableName: tableName,
    Key: marshall({
      PK: INGREDIENT_PK(ingredientId),
      SK: INGREDIENT_SK,
    }),
  }

  const results = await dynamoDb.send(new GetItemCommand(input))

  if (!results.Item) return

  const item = unmarshall(results.Item) as Ingredient

  return item
}
