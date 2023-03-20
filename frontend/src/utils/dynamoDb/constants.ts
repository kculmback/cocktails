import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { marshallOptions as MarshallOptions } from '@aws-sdk/util-dynamodb'

export const tableName = process.env.TABLE_NAME ?? ''
export const marshallOptions: MarshallOptions = {
  convertEmptyValues: true,
  removeUndefinedValues: true,
}
export const dynamoDb = new DynamoDBClient({ region: process.env.REGION })

export const COCKTAIL_PK = (id: string) => `${COCKTAIL_SK}#${id}`
export const COCKTAIL_SK = 'COCKTAIL'

export const INGREDIENT_PK = (id: string) => `${INGREDIENT_SK}#${id}`
export const INGREDIENT_SK = 'INGREDIENT'

export const TAG_PK = (id: string) => `${TAG_SK}#${id}`
export const TAG_SK = 'TAG'

export type DbItem<T> = Omit<T, 'id'> & {
  id: string
  PK: string
  SK: string
  'GSI-PK-1': string
  'GSI-SK-1': string
  lastUpdated: string
}
