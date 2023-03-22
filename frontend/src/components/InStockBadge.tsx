import { Badge, BadgeProps, chakra, forwardRef } from '@chakra-ui/react'
import { MdCheck, MdClose } from 'react-icons/md'

export type InStockBadgeProps = { inStock: boolean } & BadgeProps

export const InStockBadge = forwardRef<InStockBadgeProps, 'span'>(function InStockBadge(
  { inStock, ...props },
  ref
) {
  return (
    <Badge
      ref={ref}
      alignItems="center"
      borderRadius="sm"
      colorScheme={inStock ? 'green' : 'red'}
      display="inline-flex"
      fontSize="2xs"
      {...props}
    >
      {inStock ? <MdCheck /> : <MdClose />}
      <chakra.span ml="1">{inStock ? 'In Stock' : 'Out of Stock'}</chakra.span>
    </Badge>
  )
})
