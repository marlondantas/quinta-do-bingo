import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { BingoCard } from '../../types/bingo';
import { pokemonData } from '../../lib/pokemonData';
import BingoCell from '../../components/BingoCell';
import { LastDrawnNumberService } from '@/lib/lastDrawnNumbers';
import { analytics } from '../../services/analytics';

export default function BingoCardPage() {
  const router = useRouter();
  const { id } = router.query;
  const [bingoCards, setBingoCards] = useLocalStorage<BingoCard[]>('bingo-cards', []);
  const [currentCard, setCurrentCard] = useState<BingoCard | null>(null);

  useEffect(() => {
    if (id && bingoCards.length > 0) {
      const card = bingoCards.find(card => card.id === id);
      if (card) {
        setCurrentCard(card);
      } else {
        router.push('/');
      }
    }
  }, [id, bingoCards, router]);

  const handleCellClick = (index: number) => {
  if (!currentCard) return;

  const newMarkedPositions = [...currentCard.markedPositions];
  const positionIndex = newMarkedPositions.indexOf(index);
  
  // Determinar se está marcando ou desmarcando
  const isMarking = positionIndex === -1;
  
  if (positionIndex > -1) {
    // Desmarcando - remover da lista
    newMarkedPositions.splice(positionIndex, 1);
  } else {
    // Marcando - adicionar à lista
    newMarkedPositions.push(index);
  }

  const updatedCard = { ...currentCard, markedPositions: newMarkedPositions };
  setCurrentCard(updatedCard);

  // Analytics com dados corretos
  analytics.trackCellMarking({
    cardId: currentCard.id,
    cardName: currentCard.name,
    pokemons: currentCard.pokemons,
    markedPositions: newMarkedPositions,
    lastMarkedPosition: index,
    timestamp: new Date().toISOString()
  });

  // Atualizar no localStorage
  const updatedCards = bingoCards.map(card =>
    card.id === currentCard.id ? updatedCard : card
  );
  setBingoCards(updatedCards);
};

  const checkBingo = () => {
    if (!currentCard) return false;

    // Verificar linhas horizontais
    for (let i = 0; i < 5; i++) {
      const row = [i * 5, i * 5 + 1, i * 5 + 2, i * 5 + 3, i * 5 + 4];
      if (row.every(pos => currentCard.markedPositions.includes(pos))) {
        return true;
      }
    }

    // Verificar colunas verticais
    for (let i = 0; i < 5; i++) {
      const col = [i, i + 5, i + 10, i + 15, i + 20];
      if (col.every(pos => currentCard.markedPositions.includes(pos))) {
        return true;
      }
    }

    // Verificar diagonais
    const diagonal1 = [0, 6, 12, 18, 24];
    const diagonal2 = [4, 8, 12, 16, 20];

    if (diagonal1.every(pos => currentCard.markedPositions.includes(pos)) ||
      diagonal2.every(pos => currentCard.markedPositions.includes(pos))) {
      return true;
    }

    return false;
  };

  const resetCard = () => {
    if (!currentCard) return;

    const updatedCard = { ...currentCard, markedPositions: [] };
    setCurrentCard(updatedCard);

    const updatedCards = bingoCards.map(card =>
      card.id === currentCard.id ? updatedCard : card
    );
    setBingoCards(updatedCards);
  };

  if (!currentCard) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  const hasBingo = checkBingo();
  const drawnNumbers = LastDrawnNumberService.getAll();

  return (
    <Layout title={`${currentCard.name} - Bingo Pokémon`}>
      <div className="max-w-2xl mx-auto">
        <Card>

          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-primary">{currentCard.name}</CardTitle>
              <Button variant="outline" onClick={() => router.push('/')}>
                Voltar
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {/* Grid do Bingo */}
            <div className="grid grid-cols-5 gap-2 mb-6">

              {currentCard.pokemons.map((pokemonNumber, index) => {
                const isCenter = index === 12;
                const isMarked = currentCard.markedPositions.includes(index);

                // Determinar o ID da carta baseado no tipo de conteúdo
                let cardId: string;
                if (isCenter) {
                  cardId = 'LIVRE';
                } else if (typeof pokemonNumber === 'number' && pokemonNumber >= 1 && pokemonNumber <= 8 && ([0, 4, 20, 24]).includes(index)) {
                  // Energias - usar um ID especial
                  cardId = `ENERGY-${pokemonNumber}`;
                } else if (typeof pokemonNumber === 'number' && !([0, 4, 20, 24]).includes(index)) {
                  // Pokémon - usar o ID real da carta
                  cardId = pokemonData.getPokemonId(pokemonNumber);
                } else {
                  // Fallback para outros tipos
                  cardId = String(pokemonNumber);
                }

                return (
                  <BingoCell
                    key={index}
                    id={cardId}
                    isCenter={isCenter}
                    isMarked={isMarked}
                    onClick={() => handleCellClick(index)}
                  />
                );
              })}
            </div>

            {/* Controles */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={resetCard}
                className="flex-1"
              >
                Limpar Cartela
              </Button>

              {hasBingo && (
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled
                >
                  🎉 BINGO! 🎉
                </Button>
              )}
            </div>

            {/* Estatísticas */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Posições Marcadas</p>
                  <p className="text-2xl font-bold text-primary">
                    {currentCard.markedPositions.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-2xl font-bold">
                    {hasBingo ? '🎉 BINGO!' : 'Jogando...'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <br>
      </br>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Últimos pokemons tirados</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {drawnNumbers.map((drawn, index) => (
                    <div 
                        key={`${drawn.lastDrawnId}-${index}`}
                        className="drawn-number-card"
                    >
                        <BingoCell
                            id={drawn.lastDrawnId}
                            isCenter={false}
                            isMarked={true} // Sempre marcado pois foi sorteado
                            onClick={() => {}} // Sem ação, apenas visualização
                        />
                        <span className="draw-date">{drawn.date}</span>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Exemplos de diferentes tipos de células:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Cartas Pokémon (BLK-67, WHT-9, etc.)</li>
                <li>Energias (ENERGY-1, ENERGY-2, etc.)</li>
                <li>Célula LIVRE (centro da cartela)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
