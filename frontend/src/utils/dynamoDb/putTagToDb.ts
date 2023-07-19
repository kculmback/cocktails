import { Tag } from '@/schema'
import { PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { DbItem, TAG_PK, TAG_SK, dynamoDb, marshallOptions, tableName } from './constants'
import { updateCocktailsTagsToDb } from './updateCocktailsTagsToDb'

export async function putTagToDb(tag: Tag) {
  const id = tag.id
  const PK = TAG_PK(id)
  const SK = TAG_SK

  const updatedItem: DbItem<Tag> = {
    id,
    PK,
    SK,
    'GSI-PK-1': SK,
    'GSI-SK-1': PK,
    lastUpdated: new Date().toISOString(),
    label: tag.label,
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

  updateCocktailsTagsToDb(tag)

  return updatedItem
}
