import { CocktailTag } from '@/schema'
import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { COCKTAIL_SK, TAG_PK, dynamoDb, tableName } from './constants'

export async function getAllCocktailsForTagFromDb(tagId: string) {
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
