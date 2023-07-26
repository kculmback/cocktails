import { ButtonLink, InStockBadge } from '@/components'
import { Cocktail, CocktailWithRelations } from '@/schema'
import { trpc } from '@/utils/trpc'
import {
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardProps,
  HStack,
  Heading,
  Icon,
  IconButton,
  ImageProps,
  Stack,
  Tag,
  Text,
  Wrap,
  WrapItem,
  forwardRef,
  useToast,
} from '@chakra-ui/react'
import { isNil } from 'lodash-es'
import { MdDelete, MdOpenInNew } from 'react-icons/md'
import type { SetOptional } from 'type-fest'
import { CocktailImage } from './CocktailImage'

export type CocktailCardProp = {
  cocktail: CocktailWithRelations | SetOptional<Cocktail, 'inStock'>
  cocktailImageProps?: ImageProps
  includeActions?: boolean
} & CardProps

export const CocktailCard = forwardRef<CocktailCardProp, 'div'>(function CocktailCard(
  { cocktail, cocktailImageProps = {}, includeActions, ...props },
  ref
) {
  return (
    <Card ref={ref} direction={{ base: 'column', md: 'row' }} overflow="hidden" {...props}>
      <CocktailImage
        flexShrink={0}
        maxW={{ base: '100%', md: '300px' }}
        objectFit="cover"
        {...cocktailImageProps}
        src={cocktail.image ?? undefined}
      />

      <Stack w="full">
        <CardBody>
          <Stack>
            <HStack justifyContent="space-between">
              <HStack>
                <Heading as="h2" size="sm">
                  {cocktail.label}
                </Heading>

                {!!cocktail.url && (
                  <IconButton
                    aria-label="Open link in new window"
                    as="a"
                    href={cocktail.url}
                    icon={<MdOpenInNew />}
                    rel="noopener noreferrer nofollow"
                    size="sm"
                    target={cocktail.id}
                    variant="ghost"
                  />
                )}
              </HStack>

              {!isNil(cocktail.inStock) && <InStockBadge inStock={cocktail.inStock} />}
            </HStack>

            <Text lineHeight={1.2}>{cocktail.description}</Text>

            {'tags' in cocktail && (
              <Wrap spacing="1">
                {(cocktail.tags ?? []).map((tag) => (
                  <WrapItem key={tag.id}>
                    <Tag colorScheme="blue">{tag.label}</Tag>
                  </WrapItem>
                ))}
              </Wrap>
            )}
          </Stack>
        </CardBody>

        <CardFooter pt="0">
          <ButtonGroup justifyContent="flex-end" spacing="1" w="full">
            <ButtonLink href={`/cocktails/${cocktail.id}`}>View</ButtonLink>
            {!!includeActions && (
              <>
                <ButtonLink href={`/cocktails/${cocktail.id}/edit`}>Edit</ButtonLink>
                <RemoveCocktail cocktailId={cocktail.id} />
              </>
            )}
          </ButtonGroup>
        </CardFooter>
      </Stack>
    </Card>
  )
})

function RemoveCocktail({ cocktailId }: { cocktailId: string }) {
  const toast = useToast({
    position: 'top-right',
  })

  const utils = trpc.useContext()

  const removeCocktail = trpc.removeCocktail.useMutation({
    onSuccess() {
      utils.getAllCocktails.invalidate()

      toast({
        status: 'success',
        title: 'Successfully deleted cocktail',
      })
    },
  })

  return (
    <IconButton
      aria-label="Remove ingredient"
      colorScheme="red"
      icon={<Icon as={MdDelete} boxSize="5" />}
      isLoading={removeCocktail.isLoading}
      onClick={() => removeCocktail.mutate({ id: cocktailId })}
    />
  )
}
