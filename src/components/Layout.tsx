import React from 'react';
import Head from 'next/head';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = "Quinta! Quinta dos pokemons" }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Bingo Pokémon - Divirta-se com seus pokémons favoritos!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="bg-primary text-primary-foreground py-6 shadow-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center">
              Quinta do Bingo!!
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-primary text-primary-foreground py-4 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">
              Feito com carinho ❤️ @Lua azul
            </p>
            <p className="text-sm">
              Teste  a gente faz em produção 😎🤞
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
