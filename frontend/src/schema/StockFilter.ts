import { z } from 'zod'

export const StockFilterSchema = z.enum(['all', 'inStock', 'outOfStock'])

export type StockFilter = z.infer<typeof StockFilterSchema>
