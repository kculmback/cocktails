import { IngredientFormDrawer, InStockBadge } from '@/components'
import { IngredientCocktailsDrawer } from '@/components/Ingredients/IngredientCocktailsDrawer'
import { Ingredient as IngredientType, StockFilter } from '@/schema'
import { trpc } from '@/utils/trpc'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
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
  Skeleton,
  Stack,
  useDisclosure,
  useRadio,
  useRadioGroup,
  UseRadioProps,
} from '@chakra-ui/react'
import { range, startCase } from 'lodash-es'
import Head from 'next/head'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'

const filterOptions: StockFilter[] = ['all', 'inStock', 'outOfStock']

export default function Ingredients() {
  const [filter, setFilter] = useState(filterOptions[0])

  const ingredients = trpc.getAllIngredients.useQuery({ filter })

  return (
    <>
      <Head>
        <title>Cocktails - Ingredients</title>
      </Head>

      <chakra.main>
        <Container py="8">
          <Stack spacing="6">
            <HStack justifyContent="space-between">
              <Heading as="h1" size="lg">
                Ingredients
              </Heading>

              <IngredientToggle filter={filter} setFilter={setFilter} />
            </HStack>

            <Stack spacing="4">
              {ingredients.isLoading ? (
                range(0, 3).map((i) => <Skeleton key={i} borderRadius="md" h="32" />)
              ) : ingredients.isError ? (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>Could not retrieve ingredients.</AlertTitle>
                </Alert>
              ) : !ingredients.data?.length ? (
                <Alert>
                  <AlertIcon />
                  <AlertTitle>No ingredients found.</AlertTitle>
                </Alert>
              ) : (
                ingredients.data?.map((ingredient) => (
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

function IngredientToggle({
  filter,
  setFilter,
}: {
  filter: StockFilter
  setFilter: Dispatch<SetStateAction<StockFilter>>
}) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'ingredient',
    value: filter,
    onChange: (value: StockFilter) => setFilter(value),
  })

  const group = getRootProps()

  return (
    <HStack
      {...group}
      spacing="0"
      sx={{
        '> label:first-of-type > .ingredient-toggle': {
          borderLeftRadius: 'md',
        },
        '> label:last-of-type > .ingredient-toggle': {
          borderRightRadius: 'md',
        },
      }}
    >
      {filterOptions.map((value) => {
        const radio = getRadioProps({ value })
        return (
          <IngredientToggleOption key={value} {...radio}>
            {startCase(value)}
          </IngredientToggleOption>
        )
      })}
    </HStack>
  )
}

function IngredientToggleOption(props: UseRadioProps & { children: ReactNode }) {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        _checked={{
          bg: 'blue.500',
          color: 'white',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        bg="white"
        boxShadow="sm"
        className="ingredient-toggle"
        cursor="pointer"
        fontWeight="medium"
        px={3}
        py={2}
      >
        {props.children}
      </Box>
    </Box>
  )
}

function Ingredient({ ingredient }: { ingredient: IngredientType }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isOpenCocktailPanel,
    onOpen: onOpenCocktailPanel,
    onClose: onCloseCocktailPanel,
  } = useDisclosure()

  const removeIngredient = trpc.removeIngredient.useMutation()

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
            <Button onClick={onOpenCocktailPanel}>View Cocktails</Button>
            <Button onClick={onOpen}>Edit</Button>
            <Button
              colorScheme="red"
              isLoading={removeIngredient.isLoading}
              onClick={() => removeIngredient.mutate({ id: ingredient.id })}
            >
              Remove
            </Button>
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
