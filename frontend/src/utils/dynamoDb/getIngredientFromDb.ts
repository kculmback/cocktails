import { Ingredient } from '@/schema'
import { GetItemCommand, GetItemCommandInput } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { INGREDIENT_PK, INGREDIENT_SK, dynamoDb, tableName } from './constants'

export async function getIngredientFromDb(ingredientId: string) {
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
