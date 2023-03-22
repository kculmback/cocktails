import { ButtonLink, InStockBadge } from '@/components'
import { Cocktail } from '@/schema'
import { trpc } from '@/utils/trpc'
import {
  Card,
  CardBody,
  CardFooter,
  CardProps,
  forwardRef,
  Heading,
  HStack,
  IconButton,
  Skeleton,
  Stack,
  Tag,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { isNil, range } from 'lodash-es'
import { MdOpenInNew } from 'react-icons/md'
import { CocktailImage } from './CocktailImage'
import type { SetOptional } from 'type-fest'

export type CocktailCardProp = {
  cocktail: SetOptional<Cocktail, 'inStock'>
  includeActions?: boolean
} & CardProps

export const CocktailCard = forwardRef<CocktailCardProp, 'div'>(function CocktailCard(
  { cocktail, includeActions, ...props },
  ref
) {
  const tags = trpc.getTagsForCocktail.useQuery({ id: cocktail.id })

  return (
    <Card ref={ref} direction={{ base: 'column', md: 'row' }} overflow="hidden" {...props}>
      <CocktailImage
        flexShrink={0}
        maxW={{ base: '100%', md: '300px' }}
        objectFit="cover"
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

            <Wrap spacing="2">
              {tags.isLoading
                ? range(0, 3).map((i) => <Skeleton key={i}>Loading</Skeleton>)
                : (tags.data ?? []).map(({ tag }) => (
                    <WrapItem key={tag.id}>
                      <Tag colorScheme="blue">{tag.label}</Tag>
                    </WrapItem>
                  ))}
            </Wrap>
          </Stack>
        </CardBody>

        {!!includeActions && (
          <CardFooter pt="0">
            <HStack justifyContent="flex-end" w="full">
              <ButtonLink href={`/cocktails/${cocktail.id}`}>View</ButtonLink>
              <ButtonLink href={`/cocktails/${cocktail.id}/edit`}>Edit</ButtonLink>
            </HStack>
          </CardFooter>
        )}
      </Stack>
    </Card>
  )
})
