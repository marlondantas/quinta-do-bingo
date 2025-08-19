import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { bingoUtils } from '@/lib/seedGenerator';

import { BingoCard } from '../types/bingo';
import ImageTest from '../components/ImageTest';
import BingoCell from '../components/BingoCell';
import { LastDrawnNumber } from '@/lib/lastDrawnNumbers';

export default function Home() {
  const router = useRouter();
  const [bingoCards, setBingoCards] = useLocalStorage<BingoCard[]>('bingo-cards', []);
  const [cardName, setCardName] = useState('');

  // Função para gerar cartela baseada no nome usando seed generator
  const generateCardFromName = (name: string): (number | string)[] => {
    return bingoUtils.generateCardByName(name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardName.trim()) {
      alert('Por favor, insira um nome para a cartela!');
      return;
    }

    const generatedPokemons = generateCardFromName(cardName);

    const newCard: BingoCard = {
      id: Date.now().toString(),
      name: cardName,
      pokemons: generatedPokemons,
      markedPositions: [],
      createdAt: new Date()
    };

    setBingoCards([...bingoCards, newCard]);
    setCardName('');
  };

  const handleCardClick = (cardId: string) => {
    router.push(`/card/${cardId}`);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Tem certeza que deseja excluir esta cartela?')) {
      setBingoCards(bingoCards.filter((card: BingoCard) => card.id !== cardId));
    }
  };


  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário para criar cartela */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Criar Nova Cartela</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Nome da Cartela
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Digite o nome da cartela"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      A cartela será gerada automaticamente com Pokémon únicos e energias TCG
                    </p>
                  </div>

                  <Button type="submit" className="w-full">
                    Gerar Cartela
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Lista de cartelas */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Suas Cartelas</CardTitle>
              </CardHeader>
              <CardContent>
                {bingoCards.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhuma cartela criada ainda. Crie sua primeira cartela!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {bingoCards.map((card: BingoCard) => (
                      <div
                        key={card.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium">{card.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Criada em {card.createdAt.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCardClick(card.id)}
                          >
                            Jogar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCard(card.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
