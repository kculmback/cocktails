import { StockFilter } from '@/schema'
import { Box, HStack, UseRadioProps, useRadio, useRadioGroup } from '@chakra-ui/react'
import { startCase } from 'lodash-es'
import { Dispatch, ReactNode, SetStateAction } from 'react'

export const ingredientFilterOptions: StockFilter[] = ['all', 'inStock', 'outOfStock']

export function IngredientToggle({
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
      {ingredientFilterOptions.map((value) => {
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
