import { ButtonLink } from '@/components'
// import { trpc } from '@/utils/trpc'
import { Stack } from '@chakra-ui/react'

export default function Home() {
  // const locationsQuery = trpc.locations.list.useQuery()

  return (
    <Stack>
      <ButtonLink href="/locations/create">Create</ButtonLink>
    </Stack>
  )
}
