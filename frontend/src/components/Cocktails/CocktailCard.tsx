import { ButtonLink } from '@/components'
import { Cocktail } from '@/schema'
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
  Stack,
  Text,
} from '@chakra-ui/react'
import { MdOpenInNew } from 'react-icons/md'

export type CocktailCardProp = {
  cocktail: Cocktail
  includeActions?: boolean
} & CardProps

export const CocktailCard = forwardRef<CocktailCardProp, 'div'>(function CocktailCard(
  { cocktail, includeActions, ...props },
  ref
) {
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

          <Text>{cocktail.description}</Text>
        </CardBody>

        {!!includeActions && (
          <CardFooter>
            <HStack>
              <ButtonLink href={`/cocktails/${cocktail.id}`}>View</ButtonLink>
              <ButtonLink href={`/cocktails/${cocktail.id}/edit`}>Edit</ButtonLink>
            </HStack>
          </CardFooter>
        )}
      </Stack>
    </Card>
  )
})
