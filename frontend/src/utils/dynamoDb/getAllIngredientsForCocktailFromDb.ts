import { CocktailIngredient } from '@/schema'
import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { COCKTAIL_PK, INGREDIENT_SK, dynamoDb, tableName } from './constants'

export async function getAllIngredientsForCocktailFromDb(cocktailId: string) {
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
