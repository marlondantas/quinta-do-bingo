# Componente BingoCell

O componente `BingoCell` é responsável por renderizar cada célula individual do bingo Pokémon, exibindo o ID da carta e sua imagem correspondente.

## Características

- **Formato**: ID da carta na parte superior, separador visual, e imagem da carta na parte inferior
- **Responsivo**: Otimizado para visualização em dispositivos móveis
- **Tipos de Conteúdo**: Suporta cartas Pokémon, energias e células LIVRE
- **Interativo**: Suporta cliques para marcar/desmarcar células
- **Fallback**: Exibe placeholder quando a imagem não está disponível

## Props

```typescript
interface BingoCellProps {
  id: string;           // ID da carta (ex: "BLK-67", "ENERGY-1", "LIVRE")
  isMarked?: boolean;   // Se a célula está marcada
  isCenter?: boolean;   // Se é a célula central (LIVRE)
  onClick?: () => void; // Função de callback para cliques
  className?: string;   // Classes CSS adicionais
}
```

## Tipos de Células

### 1. Cartas Pokémon
- **ID**: Formato `XXX-YY` (ex: "BLK-67", "WHT-9")
- **Exibição**: ID + imagem da carta via API `/api/image/{id}`

### 2. Energias
- **ID**: Formato `ENERGY-X` onde X é de 1 a 8
- **Exibição**: Nome da energia + símbolo colorido
- **Cores**:
  - 1: Grass (Verde)
  - 2: Fire (Vermelho)
  - 3: Water (Azul)
  - 4: Lightning (Amarelo)
  - 5: Psychic (Roxo)
  - 6: Fighting (Laranja)
  - 7: Darkness (Cinza escuro)
  - 8: Metal (Cinza claro)

### 3. Célula LIVRE
- **ID**: "LIVRE"
- **Exibição**: Texto "LIVRE" em destaque
- **Uso**: Célula central da cartela

## Exemplo de Uso

```tsx
import BingoCell from '@/components/BingoCell';

// Carta Pokémon
<BingoCell id="BLK-67" />

// Energia
<BingoCell id="ENERGY-1" />

// Célula LIVRE
<BingoCell id="LIVRE" isCenter={true} />

// Célula marcada
<BingoCell id="WHT-9" isMarked={true} onClick={() => handleClick()} />
```

## Estilização

O componente usa Tailwind CSS e segue o design system do projeto:
- Aspect ratio 3:4 (formato de carta)
- Bordas arredondadas
- Estados hover e marcado
- Cores consistentes com o tema

## API de Imagens

As imagens são carregadas através da API `/api/image/{id}` que:
- Busca imagens de um serviço externo
- Implementa cache para melhor performance
- Fornece fallback para imagens não encontradas
- Suporta diferentes formatos de carta
