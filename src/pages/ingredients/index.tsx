import {
  ingredientFilterOptions,
  IngredientFormDrawer,
  IngredientSortBy,
  IngredientToggle,
  InStockBadge,
  useIngredientSortBy,
} from '@/components'
import { IngredientCocktailsDrawer } from '@/components/Ingredients/IngredientCocktailsDrawer'
import { IngredientWithRelations } from '@/schema'
import { trpc } from '@/utils/trpc'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  chakra,
  Container,
  Heading,
  HStack,
  Icon,
  IconButton,
  Skeleton,
  Stack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { range } from 'lodash-es'
import Head from 'next/head'
import { useState } from 'react'
import { MdDelete } from 'react-icons/md'

export default function Ingredients() {
  const [filter, setFilter] = useState(ingredientFilterOptions[0])

  const ingredientsQuery = trpc.getAllIngredients.useQuery({ filter })

  const { isAscending, setIsAscending, sortBy, setSortBy, sortedIngredients } = useIngredientSortBy(
    ingredientsQuery.data
  )

  return (
    <>
      <Head>
        <title>Cocktails - Ingredients</title>
      </Head>

      <chakra.main>
        <Container py="8">
          <Stack spacing="6">
            <Stack>
              <Heading as="h1" size="lg">
                Ingredients
              </Heading>

              <HStack alignItems="flex-end" justifyContent="space-between">
                <IngredientSortBy
                  isAscending={isAscending}
                  setIsAscending={setIsAscending}
                  setSortBy={setSortBy}
                  sortBy={sortBy}
                />
                <IngredientToggle filter={filter} setFilter={setFilter} />
              </HStack>
            </Stack>

            <Stack spacing="4">
              {ingredientsQuery.isLoading ? (
                range(0, 3).map((i) => <Skeleton key={i} borderRadius="md" h="32" />)
              ) : ingredientsQuery.isError ? (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>Could not retrieve ingredients.</AlertTitle>
                </Alert>
              ) : !sortedIngredients.length ? (
                <Alert>
                  <AlertIcon />
                  <AlertTitle>No ingredients found.</AlertTitle>
                </Alert>
              ) : (
                sortedIngredients.map((ingredient) => (
                  <Ingredient key={ingredient.id} ingredient={ingredient} />
                ))
              )}
            </Stack>
          </Stack>
        </Container>
      </chakra.main>
    </>
  )
}

function Ingredient({ ingredient }: { ingredient: IngredientWithRelations }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isOpenCocktailPanel,
    onOpen: onOpenCocktailPanel,
    onClose: onCloseCocktailPanel,
  } = useDisclosure()

  const toast = useToast({
    position: 'top-right',
  })

  const utils = trpc.useContext()

  const removeIngredient = trpc.removeIngredient.useMutation({
    onSuccess() {
      utils.getAllIngredients.invalidate()

      toast({
        status: 'success',
        title: 'Successfully deleted ingredient',
      })
    },
  })

  return (
    <>
      <Card size="sm">
        <CardHeader>
          <HStack justifyContent="space-between">
            <Heading key={ingredient.id} as="h2" size="sm">
              {ingredient.label}
            </Heading>

            <InStockBadge inStock={ingredient.inStock} />
          </HStack>
        </CardHeader>

        <CardBody py="0">{ingredient.description ?? 'No description'}</CardBody>

        <CardFooter>
          <ButtonGroup justifyContent="flex-end" size="sm" spacing="1" w="full">
            <Button onClick={onOpenCocktailPanel}>
              View Cocktails ({ingredient.cocktails.length ?? 0})
            </Button>
            <Button onClick={onOpen}>Edit</Button>
            <IconButton
              aria-label="Remove ingredient"
              colorScheme="red"
              icon={<Icon as={MdDelete} boxSize="5" />}
              isLoading={removeIngredient.isLoading}
              onClick={() => removeIngredient.mutate({ id: ingredient.id })}
            />
          </ButtonGroup>
        </CardFooter>
      </Card>

      {isOpen && <IngredientFormDrawer ingredient={ingredient} onClose={onClose} />}
      {isOpenCocktailPanel && (
        <IngredientCocktailsDrawer ingredient={ingredient} onClose={onCloseCocktailPanel} />
      )}
    </>
  )
}
