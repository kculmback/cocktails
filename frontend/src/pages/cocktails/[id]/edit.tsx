import { CocktailForm } from '@/components'
import { trpc } from '@/utils/trpc'
import { chakra, Container, Heading, Stack } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function CocktailEdit() {
  const router = useRouter()
  const id = router.query.id as string

  const cocktail = trpc.getCocktail.useQuery({ id }, { enabled: !!id })

  return (
    <>
      <Head>
        <title>Cocktails - Edit</title>
      </Head>

      <chakra.main>
        <Container py="8">
          <Stack>
            <Heading as="h1" size="lg">
              Edit
            </Heading>

            {!!cocktail.data && <CocktailForm cocktail={cocktail.data} />}
          </Stack>
        </Container>
      </chakra.main>
    </>
  )
}
