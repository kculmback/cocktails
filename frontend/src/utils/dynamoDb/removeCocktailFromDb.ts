import {
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  DeleteItemCommand,
  DeleteItemCommandInput,
  WriteRequest,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { COCKTAIL_PK, COCKTAIL_SK, INGREDIENT_PK, TAG_PK, dynamoDb, tableName } from './constants'
import { getAllIngredientsForCocktailFromDb } from './getAllIngredientsForCocktailFromDb'
import { getAllTagsForCocktail } from './getAllTagsForCocktail'
import { chunk } from 'lodash-es'

export async function removeCocktailFromDb(cocktailId: string) {
  const [ingredientsForCocktail, tagsForCocktail] = await Promise.all([
    getAllIngredientsForCocktailFromDb(cocktailId),
    getAllTagsForCocktail(cocktailId),
  ])

  const cocktailPK = COCKTAIL_PK(cocktailId)

  const mainInput: DeleteItemCommandInput = {
    TableName: tableName,
    Key: marshall({
      PK: cocktailPK,
      SK: COCKTAIL_SK,
    }),
  }

  const deleteCocktailCommand = dynamoDb.send(new DeleteItemCommand(mainInput))

  const deleteIngredientRequests: WriteRequest[] = ingredientsForCocktail.map(({ ingredient }) => {
    const ingredientPK = INGREDIENT_PK(ingredient.id)

    return {
      DeleteRequest: {
        Key: marshall({
          PK: cocktailPK,
          SK: ingredientPK,
        }),
      },
    }
  })

  const deleteTagRequests: WriteRequest[] = tagsForCocktail.map(({ tag }) => {
    const tagPK = TAG_PK(tag.id)

    return {
      DeleteRequest: {
        Key: marshall({
          PK: cocktailPK,
          SK: tagPK,
        }),
      },
    }
  })

  const batches = chunk([...deleteIngredientRequests, ...deleteTagRequests], 25)

  const batchCommands = batches.map(async (batch) => {
    const batchCmd: BatchWriteItemCommandInput = {
      RequestItems: {
        [tableName]: batch,
      },
    }

    return dynamoDb.send(new BatchWriteItemCommand(batchCmd))
  })

  await Promise.all([deleteCocktailCommand, ...batchCommands])
}
