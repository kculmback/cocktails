import { ButtonLink } from '@/components'
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
  Image,
  Skeleton,
  Stack,
  Tag,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { range } from 'lodash-es'
import { MdOpenInNew } from 'react-icons/md'

export type CocktailCardProp = {
  cocktail: Cocktail
  includeActions?: boolean
} & CardProps

export const CocktailCard = forwardRef<CocktailCardProp, 'div'>(function CocktailCard(
  { cocktail, includeActions, ...props },
  ref
) {
  const tags = trpc.getTagsForCocktail.useQuery({ id: cocktail.id })

  return (
    <Card
      ref={ref}
      direction={{ base: 'column', md: 'row' }}
      overflow="hidden"
      variant="outline"
      {...props}
    >
      <Image
        alt="Cocktail"
        fallbackSrc="https://cdn-icons-png.flaticon.com/512/4474/4474385.png"
        maxW={{ base: '100%', md: '300px' }}
        objectFit="cover"
        src={cocktail.image ?? undefined}
      />

      <Stack>
        <CardBody>
          <Stack>
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
