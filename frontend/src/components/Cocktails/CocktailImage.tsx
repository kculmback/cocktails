import { forwardRef, Image, ImageProps } from '@chakra-ui/react'

export const CocktailImage = forwardRef<ImageProps, 'image'>(function CocktailImage(props, ref) {
  return <Image ref={ref} alt="Cocktail" fallbackSrc="/defaultCocktailImage.jpg" {...props} />
})
