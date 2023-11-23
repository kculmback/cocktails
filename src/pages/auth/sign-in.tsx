import { Button, Container, Image, List, ListItem, chakra } from '@chakra-ui/react'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getProviders, getSession, signIn } from 'next-auth/react'

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { req, query } = context
  const session = await getSession({ req })

  if (session) {
    return {
      redirect: { destination: query.callbackUrl ?? '/' },
    }
  }

  const providers = await getProviders()

  return { props: { providers } }
}

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!providers) {
    throw new Error('no providers!!')
  }

  return (
    <Container>
      <List spacing="2" textAlign="center">
        {Object.values(providers).map((provider) => {
          return (
            <ListItem key={provider.name}>
              <Button size="lg" onClick={() => signIn(provider.id)}>
                <Image
                  alt={`${provider.name} logo`}
                  mr="2"
                  src={`${providerLogoPath}/${provider.id}.svg`}
                />
                <chakra.span>Sign in with {provider.name}</chakra.span>
              </Button>
            </ListItem>
          )
        })}
      </List>
    </Container>
  )
}

const providerLogoPath = 'https://authjs.dev/img/providers'
