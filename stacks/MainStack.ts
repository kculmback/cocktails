import { NextjsSite, StackContext, Table } from 'sst/constructs'

const hostedZone = process.env.HOSTED_ZONE ?? ''

const emailWhitelist = process.env.EMAIL_WHITELIST ?? ''

const googleId = process.env.GOOGLE_ID ?? ''
const googleSecret = process.env.GOOGLE_SECRET ?? ''

const nextAuthSecret = process.env.NEXTAUTH_SECRET ?? ''

export function MainStack({ app, stack }: StackContext) {
  // Create the table
  const table = new Table(stack, 'Cocktails', {
    fields: {
      PK: 'string',
      SK: 'string',
      'GSI-PK-1': 'string',
      'GSI-SK-1': 'string',
    },
    primaryIndex: {
      partitionKey: 'PK',
      sortKey: 'SK',
    },
    globalIndexes: {
      GSI1: {
        partitionKey: 'GSI-PK-1',
        sortKey: 'GSI-SK-1',
      },
    },
  })

  const domainName = `${app.stage === 'prod' ? '' : `${app.stage}.`}${hostedZone}`

  const nextAuthUrl = process.env.NEXTAUTH_URL ?? `https://${domainName}`

  // Create a Next.js site
  const site = new NextjsSite(stack, 'Site', {
    path: 'frontend',
    customDomain: {
      domainName,
      hostedZone,
    },
    environment: {
      // Pass the table details to our app
      REGION: app.region,
      TABLE_NAME: table.tableName,
      GOOGLE_ID: googleId,
      GOOGLE_SECRET: googleSecret,
      NEXTAUTH_URL: nextAuthUrl,
      NEXTAUTH_SECRET: nextAuthSecret,
      EMAIL_WHITELIST: emailWhitelist,
    },
  })

  // Allow the Next.js API to access the table
  site.attachPermissions([table])

  // Show the site URL in the output
  stack.addOutputs({
    URL: site.url ?? '',
  })
}
