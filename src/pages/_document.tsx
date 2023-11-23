import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta content="noindex" name="robots" />

        <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />

        <meta content="Cocktails" property="og:title" />
        <meta content="website" property="og:type" />
        <meta
          content="https://cocktails.zobelculmbacks.com/defaultCocktailImage.jpg"
          property="og:image"
        />
        <meta content="https://cocktails.zobelculmbacks.com" property="og:url" />
        <meta content="summary_large_image" name="twitter:card" />

        <meta
          content="Cocktails available at the Zobel/Culmback household."
          property="og:description"
        />
        <meta content="Cocktails" property="og:site_name" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
