import { chakra } from '@chakra-ui/react'
import Head from 'next/head'

export default function CocktailEdit() {
  // const router = useRouter()
  // const id = router.query.id as string

  // const cocktail = trpc.getCocktail.useQuery({ id }, { enabled: !!id })

  return (
    <>
      <Head>
        <title>Cocktails - Edit</title>
      </Head>

      <chakra.main>
        {/* <Container py="8">
          <Card>
            <CardHeader>
              <Heading as="h1" size="lg">
                Edit
              </Heading>
            </CardHeader>
            <CardBody>
              <Stack>
                {!!cocktail.data && (
                  <CocktailForm
                    cocktail={cocktail.data}
                    onSubmitted={({ id }) => {
                      router.push(`/cocktails/${id}`)
                    }}
                  />
                )}
              </Stack>
            </CardBody>
          </Card>
        </Container> */}
      </chakra.main>
    </>
  )
}
