import { CocktailForm } from '@/components'
import { Card, CardBody, CardHeader, chakra, Container, Heading, Stack } from '@chakra-ui/react'
import Head from 'next/head'

export default function CreateCocktail() {
  // const router = useRouter()

  return (
    <>
      <Head>
        <title>Cocktails - Create</title>
      </Head>

      <chakra.main>
        <Container py="8">
          <Card>
            <CardHeader>
              <Heading as="h1" size="lg">
                Create
              </Heading>
            </CardHeader>
            <CardBody>
              <Stack>
                <CocktailForm
                // onSubmitted={({ id }) => {
                //   router.push(`/cocktails/${id}`)
                // }}
                />
              </Stack>
            </CardBody>
          </Card>
        </Container>
      </chakra.main>
    </>
  )
}
