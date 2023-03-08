import { getAllIngredients as getAllDbIngredients } from '@/utils/dynamoDb'
import { procedure } from '../trpc'

export const getAllIngredients = procedure
  // using zod schema to validate and infer input values
  .query(async () => {
    return await getAllDbIngredients()
  })
