import { Box, Button, HStack } from '@chakra-ui/react'
import { signIn, signOut, useSession } from 'next-auth/react'

export function Navigation() {
  const { data: session } = useSession()

  return (
    <HStack bg="white" justifyContent="space-between" mb="6" px="4" py="2" shadow="md">
      <Box>
        {/* {!!session && (
          <>
            <HStack display={{ base: 'none', lg: 'flex' }}>
              <ButtonLink href="/" size="sm">
                Home
              </ButtonLink>
              <ButtonLink href="/cocktails" size="sm">
                All Cocktails
              </ButtonLink>
              <ButtonLink href="/cocktails/create" size="sm">
                Create Cocktail
              </ButtonLink>
              <ButtonLink href="/ingredients" size="sm">
                Ingredients
              </ButtonLink>
            </HStack>

            <Menu>
              <MenuButton
                as={IconButton}
                display={{ base: 'flex', lg: 'none' }}
                icon={<Icon as={MdMenu} />}
              />
              <MenuList>
                <MenuItem as={Link} href="/">
                  Home
                </MenuItem>
                <MenuItem as={Link} href="/cocktails">
                  All Cocktails
                </MenuItem>
                <MenuItem as={Link} href="/cocktails/create">
                  Create Cocktail
                </MenuItem>
                <MenuItem as={Link} href="/ingredients">
                  Ingredients
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        )} */}
      </Box>

      {!!session ? (
        <Button size="sm" onClick={() => signOut()}>
          Sign Out
        </Button>
      ) : (
        <Button size="sm" onClick={() => signIn()}>
          Sign in
        </Button>
      )}
    </HStack>
  )
}
