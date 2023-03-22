import { extendTheme, theme as baseTheme } from '@chakra-ui/react'

type Dict<T = any> = Record<string, T>

export const theme: Dict = extendTheme(baseTheme, {
  styles: { global: { 'html, body': { bg: 'gray.50', minH: '100vh' } } },
})
