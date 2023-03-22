import { extendTheme, theme as baseTheme } from '@chakra-ui/react'
import { listAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/styled-system'

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(parts.keys)

const baseStyleContainer = defineStyle({
  pl: 6,
})

const baseStyle = definePartsStyle({
  container: baseStyleContainer,
})

const listTheme = defineMultiStyleConfig({
  baseStyle,
})

export const theme = extendTheme(baseTheme, {
  styles: {
    global: {
      'html, body': { bg: 'gray.50', minH: '100vh' },
      'ul, ol': {
        pl: 6,
      },
    },
  },
  components: {
    List: listTheme,
  },
})
