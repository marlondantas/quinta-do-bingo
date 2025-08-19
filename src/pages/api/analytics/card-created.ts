import { sendToDiscord } from '@/lib/discord';
import { NextApiRequest, NextApiResponse } from 'next';

interface CardCreatedData {
  type: 'CARD_CREATED';
  id: string;
  name: string;
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
    const data: CardCreatedData = req.body;
    
    // Validate data
    if (!data.id || !data.name || !data.timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await sendToDiscord({
      embeds: [{
        title: "🎮 Nova Cartela Criada",
        description: `Uma nova cartela foi gerada no Bingo Pokémon!`,
        fields: [
          {
            name: "Nome da Cartela",
            value: data.name,
            inline: true
          },
          {
            name: "ID",
            value: data.id,
            inline: true
          },
          {
            name: "Horário",
            value: new Date(data.timestamp).toLocaleString('pt-BR'),
            inline: true
          }
        ],
        color: 0x1E90FF, // Blue color
        timestamp: data.timestamp
      }]
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking card creation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
