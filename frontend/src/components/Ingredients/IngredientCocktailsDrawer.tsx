import { Ingredient } from '@/schema'
import { trpc } from '@/utils/trpc'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  List,
  ListItem,
  Skeleton,
} from '@chakra-ui/react'
import { range } from 'lodash-es'
import { CocktailCard } from '../Cocktails'

type IngredientCocktailsDrawerProps = {
  ingredient: Ingredient
  onClose: () => void
}

export function IngredientCocktailsDrawer({ ingredient, onClose }: IngredientCocktailsDrawerProps) {
  const cocktails = trpc.getCocktailsForIngredient.useQuery({ id: ingredient.id })

  return (
    <Drawer isOpen placement="right" size="lg" onClose={() => onClose()}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{ingredient.label} Ingredient</DrawerHeader>

        <DrawerBody>
          {cocktails.isLoading ? (
            range(0, 3).map((i) => <Skeleton key={i} borderRadius="md" h="12" />)
          ) : cocktails.isError ? (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Could not retrieve cocktails.</AlertTitle>
            </Alert>
          ) : !cocktails.data?.length ? (
            <Alert>
              <AlertIcon />
              <AlertTitle>No cocktails found.</AlertTitle>
            </Alert>
          ) : (
            <List>
              {cocktails.data?.map((cocktail) => (
                <ListItem key={cocktail.cocktail.id}>
                  <CocktailCard
                    cocktail={cocktail.cocktail}
                    cocktailImageProps={{ maxW: '30%' }}
                    includeActions
                    variant="outline"
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DrawerBody>

        <DrawerFooter>
          <Button onClick={onClose}>Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
