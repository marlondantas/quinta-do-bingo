import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <title>Quinta! Quinta dos pokemons</title>
        <meta name="description" content="Bingo Pokémon - Divirta-se com seus pokémons favoritos!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
