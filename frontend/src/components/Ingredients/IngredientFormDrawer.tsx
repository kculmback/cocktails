import { Ingredient } from '@/schema'
import { UpsertIngredient } from '@/server/routers/upsertIngredient'
import { trpc } from '@/utils/trpc'
import {
  Button,
  chakra,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { IngredientFormFields, INGREDIENT_FORM_ID } from './IngredientFormFields'

type CreateIngredientDrawerProps = {
  ingredient: UpsertIngredient
  onClose: (ingredient?: Ingredient) => void
}

export function IngredientFormDrawer({ ingredient, onClose }: CreateIngredientDrawerProps) {
  const form = useForm<UpsertIngredient>({ defaultValues: ingredient })
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const mutation = trpc.upsertIngredient.useMutation()

  const onSubmit = handleSubmit(async (data) => {
    const ingredient = await mutation.mutateAsync(data)
    onClose?.(ingredient)
  })

  return (
    <Drawer isOpen placement="right" size="lg" onClose={() => onClose()}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton isDisabled={isSubmitting} />
        <DrawerHeader>{!!ingredient.id ? 'Update' : 'Create'} Ingredient</DrawerHeader>

        <DrawerBody>
          <chakra.form id={INGREDIENT_FORM_ID} onSubmit={onSubmit}>
            <IngredientFormFields form={form} />
          </chakra.form>
        </DrawerBody>

        <DrawerFooter>
          <Button isDisabled={isSubmitting} mr={2} variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button form={INGREDIENT_FORM_ID} isLoading={isSubmitting} type="submit">
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
