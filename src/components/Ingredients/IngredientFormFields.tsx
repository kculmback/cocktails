import { UpsertIngredient } from '@/server/routers/upsertIngredient'
import { trpc } from '@/utils/trpc'
import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
  Textarea,
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { Controller, UseFieldArrayReturn, UseFormReturn, useFieldArray } from 'react-hook-form'

export type IngredientFormFieldsProps = {
  form: UseFormReturn<UpsertIngredient>
}

export const INGREDIENT_FORM_ID = 'ingredient-form'

export function IngredientFormFields({ form }: IngredientFormFieldsProps) {
  const {
    control,
    register,
    formState: { errors },
  } = form

  const alternateIngredientsFieldArray = useFieldArray({ control, name: 'alternateIngredients' })

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
          placeholder="Description"
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

      <Stack>
        {alternateIngredientsFieldArray.fields.map((field, index) => (
          <AlternateIngredientRow
            key={field.id}
            form={form}
            index={index}
            {...alternateIngredientsFieldArray}
          />
        ))}
        <Button
          onClick={() =>
            alternateIngredientsFieldArray.append({
              description: '',
              id: '',
              inStock: true,
              label: '',
            })
          }
        >
          Add Alternate Ingredient
        </Button>
      </Stack>
    </Stack>
  )
}

type AlternateIngredientRowProps = {
  index: number
  form: UseFormReturn<UpsertIngredient>
} & UseFieldArrayReturn<UpsertIngredient, 'alternateIngredients', 'id'>

function AlternateIngredientRow({ form, index, remove }: AlternateIngredientRowProps) {
  const ingredients = trpc.getAllIngredients.useQuery()

  return (
    <HStack alignItems="flex-end">
      <Controller
        control={form.control}
        name={`alternateIngredients.${index}`}
        // name={`ingredients.${index}.ingredient`}
        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error } }) => (
          <FormControl flexGrow={1} id={`alternateIngredients.${index}`} isInvalid={!!error}>
            <FormLabel htmlFor={`alternateIngredients.${index}`}>Alternate Ingredient</FormLabel>

            <Select
              ref={ref}
              chakraStyles={{
                container: () => ({ flexGrow: 1 }),
              }}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.id}
              isLoading={ingredients.isLoading}
              name={name}
              options={ingredients.data ?? []}
              placeholder="Ingredient"
              value={value}
              onBlur={onBlur}
              onChange={onChange}
            />

            <FormErrorMessage>{error?.message}</FormErrorMessage>
          </FormControl>
        )}
        rules={{
          required: 'This is required',
          minLength: { value: 2, message: 'Minimum length should be 2' },
        }}
      />

      <Button flexShrink={0} onClick={() => remove(index)}>
        Remove
      </Button>
    </HStack>
  )
}
