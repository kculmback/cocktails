import { Cocktail } from '@/schema'
import { PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { COCKTAIL_PK, COCKTAIL_SK, DbItem, dynamoDb, marshallOptions, tableName } from './constants'

export async function putCocktailToDb(cocktail: Cocktail) {
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
    url: cocktail.url,
    steps: cocktail.steps,
    inStock: cocktail.inStock,
    description: cocktail.description,
    instructions: cocktail.instructions,
    image: cocktail.image,
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
