import { DeleteItemCommand, DeleteItemCommandInput } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { INGREDIENT_PK, INGREDIENT_SK, dynamoDb, tableName } from './constants'

export async function removeIngredientFromDb(ingredientId: string) {
  const input: DeleteItemCommandInput = {
    TableName: tableName,
    Key: marshall({
      PK: INGREDIENT_PK(ingredientId),
      SK: INGREDIENT_SK,
    }),
  }

  await dynamoDb.send(new DeleteItemCommand(input))
}
