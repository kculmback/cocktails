import { IngredientFormDrawer } from '@/components'
import { Ingredient as IngredientType } from '@/schema'
import { trpc } from '@/utils/trpc'
import { Box, Button, chakra, Container, Heading, Stack, useDisclosure } from '@chakra-ui/react'
import Head from 'next/head'

export default function Ingredients() {
  const ingredients = trpc.getAllIngredients.useQuery()

  return (
    <>
      <Head>
        <title>Cocktails - Ingredients</title>
      </Head>

      <chakra.main>
        <Container py="8">
          <Stack spacing="6">
            <Heading as="h1" size="lg">
              Ingredients
            </Heading>

            <Stack>
              {ingredients.data?.map((ingredient) => (
                <Ingredient key={ingredient.id} ingredient={ingredient} />
              ))}
            </Stack>
          </Stack>
        </Container>
      </chakra.main>
    </>
  )
}

function Ingredient({ ingredient }: { ingredient: IngredientType }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Box>
        <Heading key={ingredient.id} as="h2" size="sm">
          {ingredient.label}
        </Heading>

        <Button size="sm" onClick={onOpen}>
          Edit
        </Button>
      </Box>

      {isOpen && <IngredientFormDrawer ingredient={ingredient} onClose={onClose} />}
    </>
  )
}
