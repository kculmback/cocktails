import { Cocktail, CocktailIngredient, CocktailTag, Ingredient, StockFilter, Tag } from '@/schema'
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
  TAG_PK,
  TAG_SK,
} from './constants'

export async function getAllCocktails(filter?: StockFilter) {
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
      ...(isAllFilter ? {} : { ':inStock': filter === 'inStock' }),
    }),
  }

  const result = await dynamoDb.send(new QueryCommand(input))

  const statusCode = result?.$metadata?.httpStatusCode ?? 0

  if (statusCode / 100 > 2 || !result.Items) {
    throw new Error('Invalid')
  }

  const parsedResultItems = result.Items?.map((item) => unmarshall(item) as Cocktail).sort((a, b) =>
    a.label.localeCompare(b.label)
  )

  return parsedResultItems
}

export async function getAllIngredients(filter?: StockFilter) {
  const isAllFilter = !filter || filter === 'all'

  const input: QueryCommandInput = {
    TableName: tableName,
    IndexName: 'GSI1',
    KeyConditionExpression: '#pk = :ingredientPartitionKey and begins_with(#sk, :sk)',
    FilterExpression: isAllFilter ? undefined : '#inStock = :inStock',
    ExpressionAttributeNames: {
      '#pk': 'GSI-PK-1',
      '#sk': 'GSI-SK-1',
      ...(isAllFilter ? {} : { '#inStock': 'inStock' }),
    },
    ExpressionAttributeValues: marshall({
      ':ingredientPartitionKey': INGREDIENT_SK,
      ':sk': INGREDIENT_SK,
      ...(isAllFilter ? {} : { ':inStock': filter === 'inStock' }),
    }),
  }

  const result = await dynamoDb.send(new QueryCommand(input))

  const statusCode = result?.$metadata?.httpStatusCode ?? 0

  if (statusCode / 100 > 2 || !result.Items) {
    throw new Error('Invalid')
  }

  const parsedResultItems = result.Items?.map((item) => unmarshall(item) as Ingredient).sort(
    (a, b) => a.label.localeCompare(b.label)
  )

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

  const parsedResultItems = result.Items?.map(
    (item) => unmarshall(item) as CocktailIngredient
  ).sort((a, b) => a.ingredient.label.localeCompare(b.ingredient.label))

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

  const parsedResultItems = result.Items?.map(
    (item) => unmarshall(item) as CocktailIngredient
  ).sort((a, b) => a.cocktail.label.localeCompare(b.cocktail.label))

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

export async function getAllTags() {
  const input: QueryCommandInput = {
    TableName: tableName,
    IndexName: 'GSI1',
    KeyConditionExpression: '#pk = :tagPartitionKey and begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#pk': 'GSI-PK-1',
      '#sk': 'GSI-SK-1',
    },
    ExpressionAttributeValues: marshall({
      ':tagPartitionKey': TAG_SK,
      ':sk': TAG_SK,
    }),
  }

  const result = await dynamoDb.send(new QueryCommand(input))

  const statusCode = result?.$metadata?.httpStatusCode ?? 0

  if (statusCode / 100 > 2 || !result.Items) {
    throw new Error('Invalid')
  }

  const parsedResultItems = result.Items?.map((item) => unmarshall(item) as Tag).sort((a, b) =>
    a.label.localeCompare(b.label)
  )

  return parsedResultItems
}

export async function getAllTagsForCocktail(cocktailId: string) {
  const input: QueryCommandInput = {
    TableName: tableName,
    KeyConditionExpression: '#pk = :cocktailPartitionKey and begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#pk': 'PK',
      '#sk': 'SK',
    },
    ExpressionAttributeValues: marshall({
      ':cocktailPartitionKey': COCKTAIL_PK(cocktailId),
      ':sk': TAG_SK,
    }),
  }

  const result = await dynamoDb.send(new QueryCommand(input))

  const statusCode = result?.$metadata?.httpStatusCode ?? 0

  if (statusCode / 100 > 2 || !result.Items) {
    throw new Error('Invalid')
  }

  const parsedResultItems = result.Items?.map((item) => unmarshall(item) as CocktailTag).sort(
    (a, b) => a.tag.label.localeCompare(b.tag.label)
  )

  return parsedResultItems
}

export async function getAllCocktailsForTag(tagId: string) {
  const input: QueryCommandInput = {
    TableName: tableName,
    IndexName: 'GSI1',
    KeyConditionExpression: '#pk = :tagPartitionKey and begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#pk': 'GSI-PK-1',
      '#sk': 'GSI-SK-1',
    },
    ExpressionAttributeValues: marshall({
      ':tagPartitionKey': TAG_PK(tagId),
      ':sk': COCKTAIL_SK,
    }),
  }

  const result = await dynamoDb.send(new QueryCommand(input))

  const statusCode = result?.$metadata?.httpStatusCode ?? 0

  if (statusCode / 100 > 2 || !result.Items) {
    throw new Error('Invalid')
  }

  const parsedResultItems = result.Items?.map((item) => unmarshall(item) as CocktailTag).sort(
    (a, b) => a.cocktail.label.localeCompare(b.cocktail.label)
  )

  return parsedResultItems
}
