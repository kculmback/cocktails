import { UpsertIngredient } from '@/server/routers/upsertIngredient'
import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Textarea,
} from '@chakra-ui/react'
import { UseFormReturn } from 'react-hook-form'

export type IngredientFormFieldsProps = {
  form: UseFormReturn<UpsertIngredient>
}

export const INGREDIENT_FORM_ID = 'ingredient-form'

export function IngredientFormFields({ form }: IngredientFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <Stack spacing="4">
      <FormControl isInvalid={!!errors.label}>
        <FormLabel htmlFor="label">Ingredient Label</FormLabel>
        <Input
          id="label"
          placeholder="label"
          {...register('label', {
            required: 'This is required',
            minLength: { value: 2, message: 'Minimum length should be 2' },
          })}
        />
        <FormErrorMessage>{errors.label?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.description}>
        <FormLabel htmlFor="description">Ingredient Description</FormLabel>
        <Textarea
          id="description"
          placeholder="description"
          rows={4}
          {...register('description')}
        />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.description}>
        <Checkbox id="inStock" {...register('inStock')}>
          In Stock?
        </Checkbox>
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>
    </Stack>
  )
}
