import { CocktailTag, Tag } from '@/schema'
import {
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  WriteRequest,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { chunk } from 'lodash-es'
import { COCKTAIL_PK, DbItem, TAG_PK, dynamoDb, marshallOptions, tableName } from './constants'
import { getAllCocktailsForTagFromDb } from './getAllCocktailsForTagFromDb'

export async function updateCocktailsTagsToDb(tag: Tag) {
  const lastUpdated = new Date().toISOString()

  try {
    const cocktailsForTag = await getAllCocktailsForTagFromDb(tag.id)

    // update joins

    const inputs: WriteRequest[] = cocktailsForTag.map((cocktailTag) => {
      const tagPK = TAG_PK(cocktailTag.tag.id)
      const cocktailPK = COCKTAIL_PK(cocktailTag.cocktail.id)

      const item: Omit<DbItem<CocktailTag>, 'id'> = {
        PK: cocktailPK,
        SK: tagPK,
        'GSI-PK-1': tagPK,
        'GSI-SK-1': cocktailPK,
        lastUpdated,
        cocktail: cocktailTag.cocktail,
        tag,
      }

      return {
        PutRequest: {
          Item: marshall(item, marshallOptions),
        },
      }
    })

    const batches = chunk(inputs, 25)

    await Promise.all(
      batches.map(async (batch) => {
        const batchCmd: BatchWriteItemCommandInput = {
          RequestItems: {
            [tableName]: batch,
          },
        }

        await dynamoDb.send(new BatchWriteItemCommand(batchCmd))
      })
    )
  } catch (e) {}
}
