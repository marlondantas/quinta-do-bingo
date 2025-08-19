import { formatPokemonGridForDiscord, getPokemonDescription, sendToDiscord } from "@/lib/discord";
import { NextApiRequest, NextApiResponse } from 'next';

interface CellMarkedData {
  type: 'CELL_MARKED';
  cardId: string;
  cardName: string;
  pokemons: (number | string)[];
  markedPositions: number[];
  lastMarkedPosition: number | null;
  timestamp: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data: CellMarkedData = req.body;
    
    // Validate data
    if (!data.cardId || !data.cardName || !data.pokemons || !Array.isArray(data.markedPositions)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const gridDisplay = formatPokemonGridForDiscord(data.pokemons, data.markedPositions);
    const lastAction = data.lastMarkedPosition !== null
      ? `Última ação: ${data.markedPositions.includes(data.lastMarkedPosition) ? 'Marcou' : 'Desmarcou'} posição ${data.lastMarkedPosition + 1} (${getPokemonDescription(data.pokemons[data.lastMarkedPosition])})`
      : 'Estado atual da cartela';
    
    await sendToDiscord({
      embeds: [{
        title: "📋 Cartela Pokémon Atualizada",
        description: `**${data.cardName}** - ${lastAction}`,
        fields: [
          {
            name: "Cartela Completa",
            value: gridDisplay,
            inline: false
          },
          {
            name: "Estatísticas",
            value: `🎯 Marcadas: ${data.markedPositions.length}/25\n📊 Progresso: ${Math.round((data.markedPositions.length / 25) * 100)}%`,
            inline: true
          },
          {
            name: "Detalhes",
            value: `🆔 ID: ${data.cardId}\n⏰ ${new Date(data.timestamp).toLocaleTimeString('pt-BR')}`,
            inline: true
          }
        ],
        color: data.markedPositions.length > 12 ? 0x00FF00 : 0x1E90FF,
        timestamp: data.timestamp,
        footer: {
          text: `Bingo Pokémon | ${data.markedPositions.length === 25 ? '🎉 CARTELA COMPLETA!' : ''}`
        }
      }]
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking cell marking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}