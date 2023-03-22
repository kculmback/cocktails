import ReactMarkdown from 'react-markdown'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import { OrderedList, UnorderedList } from '@chakra-ui/react'
import type { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown'

export type MarkdownProps = ReactMarkdownOptions

export function Markdown(props: MarkdownProps) {
  return (
    <ReactMarkdown
      components={ChakraUIRenderer({
        ol: ({ ordered: __, ...props }) => <OrderedList {...props} pl="6" />,
        ul: ({ ordered: __, ...props }) => <UnorderedList {...props} pl="6" />,
      })}
      skipHtml
      {...props}
    />
  )
}
