import { IngredientFormDrawer } from '@/components'
import { Cocktail, CocktailIngredient, Ingredient } from '@/schema'
import { UpsertCocktail } from '@/server/routers/upsertCocktail'
import { trpc } from '@/utils/trpc'
import {
  Button,
  chakra,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
  Textarea,
} from '@chakra-ui/react'
import { CreatableSelect } from 'chakra-react-select'
import { useState } from 'react'
import {
  Controller,
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  UseFormReturn,
} from 'react-hook-form'

export type CocktailFormSchema = Omit<UpsertCocktail, 'ingredients'> & {
  ingredients: { ingredient: Ingredient; amount: string }[]
}

export type CocktailFormProps = {
  cocktail?: Cocktail & { ingredients: CocktailIngredient[] }
}

export function CocktailForm({ cocktail }: CocktailFormProps) {
  const form = useForm<CocktailFormSchema>({
    defaultValues: !!cocktail
      ? {
          ...cocktail,
          ingredients: cocktail.ingredients.map(({ ingredient, amount }) => ({
            amount,
            ingredient: {
              id: ingredient.id,
              label: ingredient.label,
              inStock: ingredient.inStock,
            },
          })),
        }
      : {
          label: '',
          ingredients: [{ amount: '' }],
        },
  })
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form

  const ingredientsFieldArray = useFieldArray({
    control,
    name: 'ingredients',
    rules: {
      minLength: 1,
      required: 'Ingredients are required',
    },
  })

  const mutation = trpc.upsertCocktail.useMutation()

  const onSubmit = handleSubmit(async ({ ingredients, ...cocktail }) => {
    await mutation.mutateAsync({
      ...cocktail,
      ingredients: ingredients.map(({ ingredient, amount }) => ({ amount, ...ingredient })),
    })
  })

  return (
    <chakra.form onSubmit={onSubmit}>
      <Stack divider={<Divider />} spacing="4">
        <Stack spacing="4">
          <FormControl isInvalid={!!errors.label}>
            <FormLabel htmlFor="label">Label</FormLabel>
            <Input
              id="label"
              placeholder="Label"
              {...register('label', {
                required: 'This is required',
                minLength: { value: 4, message: 'Minimum length should be 4' },
              })}
            />
            <FormErrorMessage>{errors.label?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.description}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              id="description"
              placeholder="Description"
              rows={5}
              {...register('description', { maxLength: { value: 500, message: 'Too long' } })}
            />
            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.image}>
            <FormLabel htmlFor="image">Image URL</FormLabel>
            <Input
              id="image"
              placeholder="https://www.images/cocktail.jpg"
              {...register('image', {
                required: 'This is required',
                minLength: { value: 4, message: 'Minimum length should be 4' },
              })}
            />
            <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.url}>
            <FormLabel htmlFor="url">Recipe URL</FormLabel>
            <Input id="url" placeholder="https://www.recipes/cocktai" {...register('url')} />
            <FormErrorMessage>{errors.url?.message}</FormErrorMessage>
          </FormControl>
        </Stack>

        <Stack>
          {ingredientsFieldArray.fields.map((field, index) => (
            <IngredientRow key={field.id} form={form} index={index} {...ingredientsFieldArray} />
          ))}
          <Button
            onClick={() =>
              ingredientsFieldArray.append({
                amount: '',
                ingredient: { id: '', inStock: true, label: '' },
              })
            }
          >
            Add Ingredient
          </Button>
        </Stack>

        <Button isLoading={isSubmitting} type="submit">
          Submit
        </Button>
      </Stack>
    </chakra.form>
  )
}

type IngredientRowProps = {
  index: number
  form: UseFormReturn<CocktailFormSchema>
} & UseFieldArrayReturn<CocktailFormSchema>

function IngredientRow({ form, index, remove, update }: IngredientRowProps) {
  const ingredients = trpc.getAllIngredients.useQuery()

  const [newIngredientLabel, setNewIngredientLabel] = useState('')

  return (
    <>
      <HStack alignItems="flex-end">
        <Controller
          control={form.control}
          name={`ingredients.${index}.ingredient`}
          render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error } }) => (
            <FormControl flexGrow={1} id={`ingredients.${index}.ingredient`} isInvalid={!!error}>
              <FormLabel htmlFor={`ingredients.${index}.ingredient`}>Ingredient</FormLabel>

              <CreatableSelect
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
                onCreateOption={(ingredientLabel) => {
                  setNewIngredientLabel(ingredientLabel)
                }}
              />

              <FormErrorMessage>{error?.message}</FormErrorMessage>
            </FormControl>
          )}
          rules={{
            required: 'This is required',
            minLength: { value: 2, message: 'Minimum length should be 2' },
          }}
        />

        <FormControl
          flexShrink={1}
          isInvalid={!!form.formState.errors.ingredients?.[0]?.amount}
          maxW="32"
        >
          <FormLabel htmlFor={`ingredients.${index}.amount`}>Amount</FormLabel>
          <Input
            id={`ingredients.${index}.amount`}
            placeholder="4 oz"
            {...form.register(`ingredients.${index}.amount`, {
              required: 'This is required',
              minLength: { value: 1, message: 'Minimum length should be 1' },
            })}
          />
          <FormErrorMessage>
            {form.formState.errors.ingredients?.[0]?.amount?.message}
          </FormErrorMessage>
        </FormControl>

        <Button flexShrink={0} onClick={() => remove(index)}>
          Remove
        </Button>
      </HStack>

      {!!newIngredientLabel && (
        <IngredientFormDrawer
          ingredient={{ label: newIngredientLabel, inStock: true }}
          onClose={(ingredient) => {
            if (!!ingredient) {
              update(index, {
                ingredient,
                amount: form.getValues().ingredients[index].amount ?? '',
              })
            }
            setNewIngredientLabel('')
          }}
        />
      )}
    </>
  )
}
