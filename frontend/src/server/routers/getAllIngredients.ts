import { getAllIngredients as getAllDbIngredients } from '@/utils/dynamoDb'
import { procedure } from '../trpc'

export const getAllIngredients = procedure.query(async () => {
  return await getAllDbIngredients()
})
