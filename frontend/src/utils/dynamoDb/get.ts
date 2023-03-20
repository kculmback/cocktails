import { Cocktail, CocktailIngredient, Ingredient } from '@/schema'
import {
  GetItemCommand,
  GetItemCommandInput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import {
  COCKTAIL_PK,
  COCKTAIL_SK,
  dynamoDb,
  INGREDIENT_PK,
  INGREDIENT_SK,
  tableName,
} from './constants'

export async function getAllCocktails(filter?: 'all' | 'available' | 'not-available') {
  const isAllFilter = !filter || filter === 'all'
  const input: QueryCommandInput = {
    TableName: tableName,
    IndexName: 'GSI1',
    KeyConditionExpression: '#pk = :cocktailPartitionKey and begins_with(#sk, :sk)',
    FilterExpression: isAllFilter ? undefined : '#inStock = :inStock',
    ExpressionAttributeNames: {
      '#pk': 'GSI-PK-1',
      '#sk': 'GSI-SK-1',
      ...(isAllFilter ? {} : { '#inStock': 'inStock' }),
    },
    ExpressionAttributeValues: marshall({
      ':cocktailPartitionKey': COCKTAIL_SK,
      ':sk': COCKTAIL_SK,
      ...(isAllFilter ? {} : { ':inStock': filter === 'available' }),
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

  const item = unmarshall(results.Item) as Cocktail

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
