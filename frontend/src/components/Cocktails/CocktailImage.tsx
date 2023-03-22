import { forwardRef, Image, ImageProps } from '@chakra-ui/react'
import defaultCocktailImage from './defaultCocktailImage.jpg'

export const CocktailImage = forwardRef<ImageProps, 'image'>(function CocktailImage(props, ref) {
  return <Image ref={ref} alt="Cocktail" fallbackSrc={defaultCocktailImage.src} {...props} />
})
