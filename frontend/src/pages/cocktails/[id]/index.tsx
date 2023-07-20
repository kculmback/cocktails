import { ButtonLink, Markdown } from '@/components'
import { CocktailImage } from '@/components/Cocktails/CocktailImage'
import { trpc } from '@/utils/trpc'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  chakra,
  Container,
  Heading,
  HStack,
  IconButton,
  ListItem,
  OrderedList,
  Skeleton,
  Stack,
  Tag,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { range } from 'lodash-es'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { MdOpenInNew } from 'react-icons/md'

export default function CocktailDetail() {
  const router = useRouter()
  const id = router.query.id as string

  const cocktail = trpc.getCocktail.useQuery({ id }, { enabled: !!id })
  const tags = trpc.getTagsForCocktail.useQuery({ id }, { enabled: !!id })

  const { status } = useSession()
  const isLoggedIn = status === 'authenticated'

  return (
    <>
      <Head>
        <title>Cocktails - {cocktail.data?.label}</title>
      </Head>

      <chakra.main>
        <Container py="8">
          {cocktail.isLoading ? (
            <Skeleton borderRadius="md" h="44" />
          ) : cocktail.isError ? (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Could not retrieve cocktail.</AlertTitle>
            </Alert>
          ) : !cocktail.data ? (
            <Alert>
              <AlertIcon />
              <AlertTitle>Cocktail not found.</AlertTitle>
            </Alert>
          ) : (
            <Card overflow="hidden">
              <CocktailImage maxH="96" objectFit="contain" src={cocktail.data.image ?? undefined} />

              <CardHeader>
                <Stack>
                  <HStack justifyContent="space-between">
                    <HStack>
                      <Heading as="h1" size="lg">
                        {cocktail.data?.label}
                      </Heading>
                    </HStack>

                    <ButtonGroup isAttached>
                      {isLoggedIn && (
                        <ButtonLink colorScheme="blue" href={`/cocktails/${id}/edit`}>
                          Edit
                        </ButtonLink>
                      )}

                      {!!cocktail.data?.url && (
                        <IconButton
                          aria-label="Open link in new window"
                          as="a"
                          href={cocktail.data.url}
                          icon={<MdOpenInNew />}
                          rel="noopener noreferrer nofollow"
                          target={cocktail.data.id}
                          variant="outline"
                        />
                      )}
                    </ButtonGroup>
                  </HStack>

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
              </CardHeader>
              <CardBody pt="0">
                <Stack spacing="4">
                  <Text lineHeight={1.2}>{cocktail.data.description ?? 'No description.'}</Text>

                  <Stack>
                    <Heading as="h2" size="sm">
                      Ingredients
                    </Heading>
                    <OrderedList pl="6">
                      {cocktail.data.ingredients.map(({ ingredient, amount }) => (
                        <ListItem key={ingredient.id}>
                          {ingredient.label} - {amount}
                        </ListItem>
                      ))}
                    </OrderedList>
                  </Stack>

                  <Stack>
                    <Heading as="h2" size="sm">
                      Instructions
                    </Heading>
                    <Markdown>{cocktail.data.instructions ?? 'No instructions.'}</Markdown>
                  </Stack>
                </Stack>
              </CardBody>
            </Card>
          )}
        </Container>
      </chakra.main>
    </>
  )
}
