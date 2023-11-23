import { Location, UpsertLocation } from '@/schema'
import { trpc } from '@/utils/trpc'
import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Textarea,
  chakra,
  useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

export type LocationForm = UpsertLocation

export type LocationFormProps = {
  location?: Location
  onSubmitted?: (location: Location) => void
}

export function LocationForm({ location, onSubmitted }: LocationFormProps) {
  const form = useForm<LocationForm>({
    defaultValues: !!location
      ? location
      : {
          name: '',
          description: '',
          image: '',
        },
  })

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form

  const toast = useToast({
    position: 'top-right',
  })

  const utils = trpc.useUtils()

  const locationMutation = trpc.locations.upsert.useMutation({
    onSuccess(location) {
      // const { id } = location

      utils.locations.list.invalidate()

      toast({
        status: 'success',
        title: 'Successfully submitted location',
      })

      onSubmitted?.(location)
    },
  })

  const onSubmit = handleSubmit(async (location) => {
    await locationMutation.mutateAsync(location)
  })

  return (
    <chakra.form onSubmit={onSubmit}>
      <Stack divider={<Divider />} spacing="6">
        <Stack spacing="4">
          <FormControl isInvalid={!!errors.name}>
            <FormLabel htmlFor="name">Label</FormLabel>
            <Input
              id="name"
              placeholder="Label"
              {...register('name', {
                required: 'This is required',
                minLength: { value: 4, message: 'Minimum length should be 4' },
              })}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
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
              {...register('image')}
            />
            <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
          </FormControl>
        </Stack>

        <Button isLoading={isSubmitting} type="submit">
          Submit
        </Button>
      </Stack>
    </chakra.form>
  )
}
