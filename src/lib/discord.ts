// Types for Discord webhook payloads
interface DiscordWebhookPayload {
  content?: string;
  embeds?: Array<{
    title?: string;
    description?: string;
    color?: number;
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
    timestamp?: string;
    footer?: {
      text: string;
      icon_url?: string;
    };
    thumbnail?: {
      url: string;
    };
    image?: {
      url: string;
    };
    author?: {
      name: string;
      url?: string;
      icon_url?: string;
    };
  }>;
  username?: string;
  avatar_url?: string;
}

export async function sendToDiscord(payload: DiscordWebhookPayload): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('Discord webhook URL not configured');
    return;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Discord webhook failed: ${response.status}`);
  }
}

export function formatCompleteGridForDiscord(numbers: number[][], marked: boolean[][]): string {
  const emojis = {
    marked: '✅',
    unmarked: '⬜',
    free: '🆓'
  };

  let result = '```\n'; // Use code block for better alignment
  
  // Header
  result += '  B   I   N   G   O\n';
  result += '─────────────────────\n';
  
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (i === 2 && j === 2) {
        result += 'FREE '; // Center is always free
      } else {
        const num = numbers[i][j].toString().padStart(2, ' ');
        const status = marked[i][j] ? '✓' : ' ';
        result += `${num}${status} `;
      }
    }
    result += '\n';
  }
  
  result += '```\n\n';
  
  // Add emoji grid for visual reference
  result += '**Estado Visual:**\n';
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (i === 2 && j === 2) {
        result += emojis.free;
      } else {
        result += marked[i][j] ? emojis.marked : emojis.unmarked;
      }
    }
    result += '\n';
  }
  
  return result;
}

export function formatGridForDiscord(grid: boolean[][]): string {
  const emojis = {
    marked: '✅',
    unmarked: '⬜',
    free: '🆓'
  };

  let result = '';
  
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (i === 2 && j === 2) {
        result += emojis.free; // Center is always free
      } else {
        result += grid[i][j] ? emojis.marked : emojis.unmarked;
      }
    }
    result += '\n';
  }
  
  return result;
}

export function formatPokemonGridForDiscord(pokemons: (number | string)[], markedPositions: number[]): string {
  const emojis = {
    marked: '✅',
    unmarked: '⬜',
    free: '🆓'
  };

  let result = '```\n';
  result += '  B     I     N     G     O\n';
  result += '─────────────────────────────\n';
  
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const index = i * 5 + j;
      const pokemon = pokemons[index];
      const isMarked = markedPositions.includes(index);
      
      if (index === 12) { // Centro
        result += 'LIVRE ';
      } else {
        const pokemonStr = String(pokemon).padEnd(4);
        const status = isMarked ? '✓' : ' ';
        result += `${pokemonStr}${status} `;
      }
    }
    result += '\n';
  }
  
  result += '```\n\n';
  
  // Grid visual com emojis
  result += '**Estado Visual:**\n';
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const index = i * 5 + j;
      
      if (index === 12) {
        result += emojis.free;
      } else {
        result += markedPositions.includes(index) ? emojis.marked : emojis.unmarked;
      }
    }
    result += '\n';
  }
  
  return result;
}

export function getPokemonDescription(pokemon: number | string): string {
  if (typeof pokemon === 'string') {
    return pokemon;
  }
  
  // Baseado na sua lógica de energias vs pokémons
  if (pokemon >= 1 && pokemon <= 8) {
    return `Energia ${pokemon}`;
  }
  
  return `Pokémon ${pokemon}`;
}