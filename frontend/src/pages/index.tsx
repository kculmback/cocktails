import { Link } from '@/components'
import { trpc } from '@/utils/trpc'
import { Box, Container, Heading, HStack, Stack } from '@chakra-ui/react'
import Head from 'next/head'

export default function Home() {
  const cocktails = trpc.getAllCocktails.useQuery({ filter: 'available' })

  return (
    <>
      <Head>
        <title>Cocktails</title>
      </Head>

      <main>
        <Container>
          <Stack>
            <Stack>
              <Heading as="h1" size="lg">
                Available Cocktails
              </Heading>
              {cocktails.data?.map((cocktail) => (
                <Heading key={cocktail.id} as="h2" size="sm">
                  {cocktail.label}
                </Heading>
              ))}
            </Stack>
          </Stack>
        </Container>
      </main>
    </>
  )
}
