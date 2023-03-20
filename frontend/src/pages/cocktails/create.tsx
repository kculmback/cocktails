import { CocktailForm } from '@/components'
import { chakra, Container, Heading, Stack } from '@chakra-ui/react'
import Head from 'next/head'

export default function CreateCocktail() {
  return (
    <>
      <Head>
        <title>Cocktails - Create</title>
      </Head>

      <chakra.main>
        <Container py="8">
          <Stack>
            <Heading as="h1" size="lg">
              Create
            </Heading>

            <CocktailForm />
          </Stack>
        </Container>
      </chakra.main>
    </>
  )
}
