import { NextjsSite, StackContext, Table } from 'sst/constructs'

const nextAuthUrl = process.env.NEXTAUTH_URL ?? ''
const googleId = process.env.GOOGLE_ID ?? ''
const googleSecret = process.env.GOOGLE_SECRET ?? ''
const emailWhitelist = process.env.EMAIL_WHITELIST ?? ''

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

  // Create a Next.js site
  const site = new NextjsSite(stack, 'Site', {
    path: 'frontend',
    environment: {
      // Pass the table details to our app
      REGION: app.region,
      TABLE_NAME: table.tableName,
      GOOGLE_ID: googleId,
      GOOGLE_SECRET: googleSecret,
      NEXTAUTH_URL: nextAuthUrl,
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
