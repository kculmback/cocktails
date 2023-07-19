import { CocktailTag, Tag } from '@/schema'
import {
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  WriteRequest,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { chunk } from 'lodash-es'
import {
  COCKTAIL_PK,
  DbItem,
  TAG_PK,
  TAG_SK,
  dynamoDb,
  marshallOptions,
  tableName,
} from './constants'
import { getCocktailFromDb } from './getCocktailFromDb'

export async function putCocktailTagsToDb(
  cocktailId: string,
  tags: Tag[],
  removedTagsIds: string[] = []
) {
  const cocktailPK = COCKTAIL_PK(cocktailId)

  const cocktail = await getCocktailFromDb(cocktailId)

  if (!cocktail) {
    throw new Error('no cocktail')
  }

  const inputs: WriteRequest[] = tags
    .map((tag): WriteRequest[] => {
      const tagId = tag.id

      const tagPK = TAG_PK(tagId)

      const lastUpdated = new Date().toISOString()

      const tagItem: DbItem<Tag> = {
        id: tagId,
        PK: tagPK,
        SK: TAG_SK,
        'GSI-PK-1': TAG_SK,
        'GSI-SK-1': tagPK,
        lastUpdated,
        label: tag.label,
      }

      const cocktailTagItem: Omit<DbItem<CocktailTag>, 'id'> = {
        PK: cocktailPK,
        SK: tagPK,
        'GSI-PK-1': tagPK,
        'GSI-SK-1': cocktailPK,
        lastUpdated,
        cocktail,
        tag: tagItem,
      }

      return [tagItem, cocktailTagItem].map((item) => ({
        PutRequest: {
          Item: marshall(item, marshallOptions),
        },
      }))
    })
    .flat()

  const removeInputs: WriteRequest[] = removedTagsIds.map((tagId) => {
    const tagPK = TAG_PK(tagId)

    return {
      DeleteRequest: {
        Key: marshall({
          PK: cocktailPK,
          SK: tagPK,
        }),
      },
    }
  })

  const batches = chunk([...inputs, ...removeInputs], 25)

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
}
