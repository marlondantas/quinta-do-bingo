import pokemonCards from '../data/pokemon-cards.json';

export interface PokemonCard {
    number: number;
    id: string;
    name: string;
    supertype: string;
    nationalPokedexNumbers: number;
    isEx: boolean;
    rarity: string;
    setId: string;
}

/**
 * Pokemon data utilities
 */
export const pokemonData = {
    /**
     * Get all Pokemon cards
     */
    getAllCards(): PokemonCard[] {
        return pokemonCards as PokemonCard[];
    },

    /**
     * Get Pokemon name by number
     */
    getPokemonName(number: number): string {
        const card = pokemonCards.find(card => card.number === number);
        return card ? card.name : `Pokemon ${number}`;
    },

    /**
     * Get Pokemon card by number
     */
    getPokemonCard(number: number): PokemonCard | undefined {
        return pokemonCards.find(card => card.number === number);
    },

    /**
     * Get Pokemon ID by number
     */
    getPokemonId(number: number): string {
        const card = pokemonCards.find(card => card.number === number);
        return card ? card.id : `UNKNOWN-${number}`;
    },

    /**
     * Get Pokemon card by ID
     */
    getPokemonCardById(id: string): PokemonCard | undefined {
        return pokemonCards.find(card => card.id === id);
    },

    /**
     * Get all Pokemon names as array
     */
    getPokemonNames(): string[] {
        return pokemonCards.map(card => card.name);
    },

    /**
     * Get Pokemon numbers array (1-125)
     */
    getPokemonNumbers(): number[] {
        return pokemonCards.map(card => card.number);
    },

    /**
     * Energy names for TCG
     */
    energyNames: [
        'Grass',
        'Fire',
        'Water',
        'Lightning',
        'Psychic',
        'Fighting',
        'Darkness',
        'Metal'
    ],

    /**
     * Get energy name by number (1-8)
     */
    getEnergyName(number: number): string {
        if (number >= 1 && number <= 8) {
            return this.energyNames[number - 1];
        }
        return 'Unknown Energy';
    },

    /**
     * Convert bingo card numbers to display values
     * Considers position: corners are energies, center is free, others are Pokemon
     */
    convertCardToDisplay(card: (number | string)[]): string[] {
        const cornerPositions = [0, 4, 20, 24]; // Cantos do card 5x5
        const centerPosition = 12; // Centro do card 5x5
        
        return card.map((value, index) => {
            // Posição central é sempre LIVRE
            if (index === centerPosition) return 'LIVRE';
            
            // Posições dos cantos são sempre energias (1-8)
            if (cornerPositions.includes(index)) {
                if (typeof value === 'number' && value >= 1 && value <= 8) {
                    return this.getEnergyName(value);
                }
                // Fallback se o valor não for uma energia válida
                return 'Energia Desconhecida';
            }
            
            // Outras posições são Pokémon (1-125)
            if (typeof value === 'number' && value >= 1 && value <= 125) {
                return this.getPokemonName(value);
            }
            
            // Fallback para valores inválidos
            return String(value);
        });
    },

    /**
     * Log bingo card in a beautiful visual format
     */
    logBingoCard(card: (number | string)[], title: string = 'Bingo Card'): void {
        const displayValues = this.convertCardToDisplay(card);
        
        console.log('\n' + '='.repeat(50));
        console.log(`🎮 ${title.toUpperCase()} 🎮`);
        console.log('='.repeat(50));
        
        // Print 5x5 grid
        for (let row = 0; row < 5; row++) {
            let rowStr = '';
            for (let col = 0; col < 5; col++) {
                const index = row * 5 + col;
                const value = displayValues[index];
                const isCenter = index === 12;
                const isCorner = [0, 4, 20, 24].includes(index);
                
                // Add visual indicators
                let prefix = ' ';
                if (isCenter) prefix = '⭐'; // Center (LIVRE)
                else if (isCorner) prefix = '⚡'; // Energy
                else prefix = '🎴'; // Pokemon
                
                // Format the cell
                const cell = `${prefix} ${value.padEnd(15)}`;
                rowStr += cell;
            }
            console.log(rowStr);
        }
        
        console.log('='.repeat(50));
        console.log('⭐ = LIVRE (Centro) | ⚡ = Energia (Cantos) | 🎴 = Pokémon');
        console.log('='.repeat(50) + '\n');
    },

    /**
     * Log bingo card with raw values for debugging
     */
    logBingoCardRaw(card: (number | string)[], title: string = 'Bingo Card (Raw Values)'): void {
        console.log('\n' + '='.repeat(50));
        console.log(`🔧 ${title.toUpperCase()} 🔧`);
        console.log('='.repeat(50));
        
        // Print 5x5 grid with raw values
        for (let row = 0; row < 5; row++) {
            let rowStr = '';
            for (let col = 0; col < 5; col++) {
                const index = row * 5 + col;
                const value = card[index];
                const isCenter = index === 12;
                const isCorner = [0, 4, 20, 24].includes(index);
                
                // Add visual indicators
                let prefix = ' ';
                if (isCenter) prefix = '⭐'; // Center
                else if (isCorner) prefix = '⚡'; // Energy
                else prefix = '🎴'; // Pokemon
                
                // Format the cell with raw value
                const cell = `${prefix} ${String(value).padEnd(5)}`;
                rowStr += cell;
            }
            console.log(rowStr);
        }
        
        console.log('='.repeat(50));
        console.log('⭐ = Centro | ⚡ = Cantos (Energias) | 🎴 = Outras posições (Pokémon)');
        console.log('='.repeat(50) + '\n');
    }
};
