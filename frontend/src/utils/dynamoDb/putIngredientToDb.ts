import { Ingredient } from '@/schema'
import { PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import {
  DbItem,
  INGREDIENT_PK,
  INGREDIENT_SK,
  dynamoDb,
  marshallOptions,
  tableName,
} from './constants'
import { updateCocktailsIngredientsToDb } from './updateCocktailsIngredientsToDb'

export async function putIngredientToDb(ingredient: Ingredient) {
  const id = ingredient.id
  const PK = INGREDIENT_PK(id)
  const SK = INGREDIENT_SK

  const updatedItem: DbItem<Ingredient> = {
    id,
    PK,
    SK,
    'GSI-PK-1': SK,
    'GSI-SK-1': PK,
    lastUpdated: new Date().toISOString(),
    inStock: ingredient.inStock,
    label: ingredient.label,
    description: ingredient.description,
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

  updateCocktailsIngredientsToDb(ingredient)

  return updatedItem
}
