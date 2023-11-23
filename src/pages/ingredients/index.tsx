import { chakra } from '@chakra-ui/react'
import Head from 'next/head'

export default function Ingredients() {
  // const [filter, setFilter] = useState(ingredientFilterOptions[0])

  // const ingredientsQuery = trpc.getAllIngredients.useQuery({ filter })

  // const { isAscending, setIsAscending, sortBy, setSortBy, sortedIngredients } = useIngredientSortBy(
  //   ingredientsQuery.data
  // )

  return (
    <>
      <Head>
        <title>Cocktails - Ingredients</title>
      </Head>

      <chakra.main>
        {/* <Container py="8">
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
        </Container> */}
      </chakra.main>
    </>
  )
}

// function Ingredient({ ingredient }: { ingredient: IngredientWithRelations }) {
//   const { isOpen, onOpen, onClose } = useDisclosure()
//   const {
//     isOpen: isOpenCocktailPanel,
//     onOpen: onOpenCocktailPanel,
//     onClose: onCloseCocktailPanel,
//   } = useDisclosure()

//   const toast = useToast({
//     position: 'top-right',
//   })

//   const utils = trpc.useContext()

//   const removeIngredient = trpc.removeIngredient.useMutation({
//     onSuccess() {
//       utils.getAllIngredients.invalidate()

//       toast({
//         status: 'success',
//         title: 'Successfully deleted ingredient',
//       })
//     },
//   })

//   return (
//     <>
//       <Card size="sm">
//         <CardHeader>
//           <HStack justifyContent="space-between">
//             <Heading key={ingredient.id} as="h2" size="sm">
//               {ingredient.label}
//             </Heading>

//             <InStockBadge inStock={ingredient.inStock} />
//           </HStack>
//         </CardHeader>

//         <CardBody py="0">
//           <Stack>
//             <Text>{ingredient.description || 'No description'}</Text>

//             {!!ingredient.mainIngredients.length && (
//               <Stack spacing="0">
//                 <Text fontSize="sm" fontWeight="medium">
//                   Main Ingredients
//                 </Text>
//                 <UnorderedList>
//                   {ingredient.mainIngredients.map((ingredient) => (
//                     <ListItem key={ingredient.id}>{ingredient.label}</ListItem>
//                   ))}
//                 </UnorderedList>
//               </Stack>
//             )}

//             {!!ingredient.alternateIngredients.length && (
//               <Stack spacing="0">
//                 <Text fontSize="sm" fontWeight="medium">
//                   Alternate Ingredients
//                 </Text>
//                 <UnorderedList>
//                   {ingredient.alternateIngredients.map((ingredient) => (
//                     <ListItem key={ingredient.id}>{ingredient.label}</ListItem>
//                   ))}
//                 </UnorderedList>
//               </Stack>
//             )}
//           </Stack>
//         </CardBody>

//         <CardFooter>
//           <ButtonGroup justifyContent="flex-end" size="sm" spacing="1" w="full">
//             <Button onClick={onOpenCocktailPanel}>
//               View Cocktails ({ingredient.cocktails.length ?? 0})
//             </Button>
//             <Button onClick={onOpen}>Edit</Button>
//             <IconButton
//               aria-label="Remove ingredient"
//               colorScheme="red"
//               icon={<Icon as={MdDelete} boxSize="5" />}
//               isLoading={removeIngredient.isLoading}
//               onClick={() => removeIngredient.mutate({ id: ingredient.id })}
//             />
//           </ButtonGroup>
//         </CardFooter>
//       </Card>

//       {isOpen && <IngredientFormDrawer ingredient={ingredient} onClose={onClose} />}
//       {isOpenCocktailPanel && (
//         <IngredientCocktailsDrawer ingredient={ingredient} onClose={onCloseCocktailPanel} />
//       )}
//     </>
//   )
// }
