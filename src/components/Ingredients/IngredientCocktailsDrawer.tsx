import { IngredientWithRelations } from '@/schema'
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
} from '@chakra-ui/react'
import { CocktailCard } from '../Cocktails'

type IngredientCocktailsDrawerProps = {
  ingredient: IngredientWithRelations
  onClose: () => void
}

export function IngredientCocktailsDrawer({ ingredient, onClose }: IngredientCocktailsDrawerProps) {
  return (
    <Drawer isOpen placement="right" size="lg" onClose={() => onClose()}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{ingredient.label} Ingredient</DrawerHeader>

        <DrawerBody>
          {!ingredient.cocktails.length ? (
            <Alert>
              <AlertIcon />
              <AlertTitle>No cocktails found.</AlertTitle>
            </Alert>
          ) : (
            <List spacing="2">
              {ingredient.cocktails.map((cocktail) => (
                <ListItem key={cocktail.id}>
                  <CocktailCard
                    cocktail={cocktail}
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
