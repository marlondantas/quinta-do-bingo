import { bingoUtils } from './seedGenerator';
import { pokemonData } from './pokemonData';

/**
 * Exemplo de uso das funções de log do Bingo Pokémon
 */

// Gerar uma cartela de exemplo
const exampleCard = bingoUtils.generateCardByName('o_marlofff');
// Log da cartela com valores convertidos (bonito)
pokemonData.logBingoCard(exampleCard, 'Cartela de Exemplo');


export {
    exampleCard
};
