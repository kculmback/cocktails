import { extendTheme, theme as baseTheme } from '@chakra-ui/react'

export const theme = extendTheme(baseTheme, {
  styles: {
    global: {
      'html, body': { bg: 'gray.50', minH: '100vh' },
      body: { pb: 8 },
    },
  },
})
