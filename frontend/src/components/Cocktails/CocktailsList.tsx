import { Cocktail } from '@/schema'
import { List } from '@chakra-ui/react'
import { AnimatePresence, motion, usePresence } from 'framer-motion'
import { CocktailCard, CocktailCardProp } from './CocktailCard'

export type CocktailsListProps = {
  cocktails: Omit<Cocktail, 'inStock'>[]
  includeActions?: boolean
}

export function CocktailsList({ cocktails, includeActions }: CocktailsListProps) {
  return (
    <List spacing="4">
      <AnimatePresence>
        {cocktails.map((cocktail) => (
          <AnimateItem key={cocktail.id} cocktail={cocktail} includeActions={includeActions} />
        ))}
      </AnimatePresence>
    </List>
  )
}

function AnimateItem(props: CocktailCardProp) {
  const [isPresent, safeToRemove] = usePresence()

  return (
    <motion.li
      {...{
        layout: true,
        initial: 'out',
        style: {
          position: isPresent ? 'static' : 'absolute',
        },
        animate: isPresent ? 'in' : 'out',
        whileTap: 'tapped',
        variants: {
          in: { opacity: 1 },
          out: { opacity: 0, zIndex: -1 },
        },
        onAnimationComplete: () => !isPresent && safeToRemove(),
        transition,
      }}
    >
      <CocktailCard {...props} />
    </motion.li>
  )
}

const transition = { type: 'spring', stiffness: 500, damping: 50, mass: 1 }
