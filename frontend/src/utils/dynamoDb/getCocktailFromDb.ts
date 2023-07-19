import { Cocktail } from '@/schema'
import { GetItemCommand, GetItemCommandInput } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { COCKTAIL_PK, COCKTAIL_SK, dynamoDb, tableName } from './constants'

export async function getCocktailFromDb(cocktailId: string) {
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
