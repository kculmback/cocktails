import { CocktailTag } from '@/schema'
import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { COCKTAIL_PK, TAG_SK, dynamoDb, tableName } from './constants'

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
