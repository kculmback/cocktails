import { ButtonLink } from '@/components'
import { trpc } from '@/utils/trpc'
import { chakra, Container, Heading, Stack } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function CocktailDetail() {
  const router = useRouter()
  const id = router.query.id as string

  const cocktail = trpc.getCocktail.useQuery({ id })

  return (
    <>
      <Head>
        <title>Cocktails - {cocktail.data?.label}</title>
      </Head>

      <chakra.main>
        <Container py="8">
          <Stack>
            <Heading as="h1" size="lg">
              Detail
            </Heading>
            <ButtonLink href={`/cocktails/${id}/edit`}>Edit</ButtonLink>
          </Stack>
        </Container>
      </chakra.main>
    </>
  )
}
