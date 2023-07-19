import { getAllTagsFromDb as getAllDbTags } from '@/utils/dynamoDb'
import { procedure } from '../trpc'

export const getAllTags = procedure.query(async () => {
  return await getAllDbTags()
})
