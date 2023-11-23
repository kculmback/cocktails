import { Card, CardBody, CardHeader, chakra, Container, Heading, Stack } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { LocationForm } from '@/components'

export default function CreateLocation() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Locations - Create</title>
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
                <LocationForm
                  onSubmitted={({ id }) => {
                    router.push(`/locations/${id}`)
                  }}
                />
              </Stack>
            </CardBody>
          </Card>
        </Container>
      </chakra.main>
    </>
  )
}
