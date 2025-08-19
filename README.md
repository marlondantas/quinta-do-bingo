# 🎮 Bingo Pokémon

Um projeto web interativo de bingo com tema Pokémon, desenvolvido com Next.js, Shadcn UI e Tailwind CSS.

## ✨ Características

- **Geração Automática de Cartelas**: Cartelas criadas automaticamente baseadas no nome inserido
- **Sistema de Seed**: Cada nome gera uma cartela única com números de 1 a 24
- **Persistência Local**: Dados salvos automaticamente no localStorage do navegador
- **Design Responsivo**: Interface adaptável para desktop e mobile
- **Tema Pokémon**: Cores e design inspirados no universo Pokémon
- **Funcionalidade Completa**: Marcação de posições, verificação de bingo e estatísticas
- **API de Imagens**: Proxy para buscar cartas do Limitless TCG evitando problemas de CORS

## 🎨 Design

O projeto utiliza as seguintes cores principais:
- **Branco**: #FFFFFF (fundo principal)
- **Azul**: #1E90FF (cor primária)
- **Azul Escuro**: #001F3F (texto e elementos secundários)

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com Page Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn UI** - Componentes de interface
- **localStorage** - Persistência de dados
- **Limitless TCG API** - Busca de imagens de cartas Pokémon

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Layout.tsx          # Layout principal com header e footer
│   ├── ImageTest.tsx       # Componente de teste da API de imagens
│   └── ui/                 # Componentes Shadcn UI
├── hooks/
│   └── useLocalStorage.ts  # Hook para gerenciar localStorage
├── pages/
│   ├── _app.tsx           # Configuração global do app
│   ├── _document.tsx      # Configuração do HTML
│   ├── index.tsx          # Página inicial
│   ├── card/[id].tsx      # Página da cartela de bingo
│   └── api/
│       └── image/[code].ts # API para buscar imagens de cartas
├── types/
│   └── bingo.ts           # Tipos TypeScript
└── lib/
    └── utils.ts           # Utilitários do Shadcn UI
```

## 🎯 Funcionalidades

### Página Inicial (`/`)
- Formulário simples para inserir o nome da cartela
- Geração automática de cartelas com números de 1 a 24
- Sistema de seed baseado no nome para garantir cartelas únicas
- Lista de cartelas criadas
- Opções para jogar ou excluir cartelas
- **Teste da API de Cartas**: Interface para testar a busca de cartas Pokémon

### Página da Cartela (`/card/[id]`)
- Visualização da cartela em formato de bingo 5x5
- Números de 1 a 24 distribuídos aleatoriamente
- Posição central livre (LIVRE)
- Marcação/desmarcação de posições com clique
- Verificação automática de bingo (linhas, colunas e diagonais)
- Estatísticas de jogo
- Botão para limpar a cartela

### API de Cartas (`/api/image/[code]`)
- **Endpoint**: `GET /api/image/[code]`
- **Formato do código**: `XXX-1` (3 letras maiúsculas + hífen + número)
- **Exemplos**: `BLK-67`, `WHT-9`, `RED-15`
- **Funcionalidades**:
  - Proxy para o Limitless TCG CDN
  - Evita problemas de CORS
  - Converte códigos para URLs do formato correto
  - Fallback para imagem SVG quando carta não encontrada
  - Cache configurável
  - Validação de formato de código
  - Timeout configurável

## 🛠️ Como Executar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente** (opcional):
   ```bash
   # Copie o arquivo de exemplo
   cp env.example .env.local
   
   # Edite as configurações do serviço externo
   EXTERNAL_IMAGE_CARD_SERVICE_URL=https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/{set}/{set}_{number}_R_PT.png
   ```

3. **Executar em desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Abrir no navegador**:
   ```
   http://localhost:3000
   ```

## 📦 Scripts Disponíveis

- `npm run dev` - Executa o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa o servidor de produção
- `npm run lint` - Executa o linter

## 🎮 Como Jogar

1. **Criar uma Cartela**:
   - Acesse a página inicial
   - Digite um nome para sua cartela
   - Clique em "Gerar Cartela"
   - A cartela será criada automaticamente com números de 1 a 24

2. **Jogar Bingo**:
   - Clique em "Jogar" na cartela desejada
   - Clique nas posições para marcá-las/desmarcá-las
   - Complete uma linha, coluna ou diagonal para ganhar
   - Use "Limpar Cartela" para recomeçar

## 🔢 Sistema de Geração

- **Seed Baseado no Nome**: Cada nome gera uma cartela única
- **Números de 1 a 24**: Distribuídos aleatoriamente nas 24 posições
- **Posição Central**: Sempre fica livre (LIVRE)
- **Consistência**: O mesmo nome sempre gera a mesma cartela

## 🖼️ API de Cartas

### Uso da API

```javascript
// Exemplo de requisição
const response = await fetch('/api/image/BLK-67');
const imageBlob = await response.blob();

// Usar em uma tag img
<img src="/api/image/BLK-67" alt="Carta BLK-67" />
```

### Formato de Códigos

A API aceita códigos no formato `XXX-1` onde:
- `XXX`: Código do set (ex: BLK, WHT, RED, GRN)
- `1`: Número da carta (será convertido para 3 dígitos: 67 → 067)

### Exemplos de URLs Geradas

- `BLK-67` → `https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/BLK/BLK_067_R_PT.png`
- `WHT-9` → `https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/WHT/WHT_009_R_PT.png`
- `RED-15` → `https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/RED/RED_015_R_PT.png`

### Configuração

A API pode ser configurada através de variáveis de ambiente:

- `EXTERNAL_IMAGE_CARD_SERVICE_URL`: URL base do serviço (padrão: Limitless TCG)
- `timeout`: Timeout da requisição (padrão: 10 segundos)

### Fallback

Quando a carta não é encontrada, a API retorna uma imagem SVG com:
- Código solicitado
- Mensagem "Imagem não encontrada"
- Fundo cinza claro

## 🎨 Personalização

O projeto pode ser facilmente personalizado:
- Modificar cores no arquivo `src/styles/globals.css`
- Adicionar novos componentes em `src/components/`
- Expandir funcionalidades nas páginas existentes
- Implementar geradores de seed mais complexos
- Configurar diferentes serviços de cartas

## 📝 Licença

Este projeto foi desenvolvido com carinho ❤️ por @Lua azul.

---

**Divirta-se jogando bingo com seus números favoritos!** 🎮✨
