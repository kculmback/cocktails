import { Ingredient, StockFilter } from '@/schema'
import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { INGREDIENT_SK, dynamoDb, tableName } from './constants'

export async function getAllIngredientsFromDb(filter?: StockFilter) {
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