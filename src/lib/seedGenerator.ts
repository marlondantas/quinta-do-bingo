/**
 * Seed Generator for Bingo Card Content
 * Provides consistent and reproducible card generation based on a seed
 */

export class SeedGenerator {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  /**
   * Generate a pseudo-random number between 0 and 1
   * Based on Linear Congruential Generator (LCG)
   */
  private random(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /**
   * Generate a random integer between min and max (inclusive)
   */
  randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  /**
   * Shuffle an array using the seed
   */
  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.randomInt(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Generate a bingo card with 25 positions (5x5 grid)
   * Position 12 (center) is always "LIVRE"
   * Corner positions [0,4,20,24] are energy numbers (1-8)
   * Other positions are Pokemon numbers (1-125)
   * ALL NUMBERS MUST BE UNIQUE
   */
  generateBingoCard(): (number | string)[] {
    // Create a 5x5 grid (25 positions)
    const card = new Array(25).fill(0);
    
    // Center position (12) is always "LIVRE" - represented as 0
    card[12] = 0;
    
    // Track used numbers to ensure uniqueness
    const usedNumbers = new Set<number>();
    
    // Corner positions: [0,4,20,24] - Energy numbers (1-8)
    const cornerPositions = [0, 4, 20, 24];
    
    // Generate unique energy numbers for corners
    for (const pos of cornerPositions) {
      let energyNumber: number;
      do {
        energyNumber = this.randomInt(1, 8);
      } while (usedNumbers.has(energyNumber));
      
      card[pos] = energyNumber;
      usedNumbers.add(energyNumber);
    }
    
    // Get remaining positions that need Pokemon numbers
    const remainingPositions = [];
    for (let i = 0; i < 25; i++) {
      if (i !== 12 && !cornerPositions.includes(i)) {
        remainingPositions.push(i);
      }
    }
    
    // Generate unique Pokemon numbers for remaining positions
    // Must avoid numbers already used in corners
    for (const pos of remainingPositions) {
      let pokemonNumber: number;
      do {
        pokemonNumber = this.randomInt(1, 125);
      } while (usedNumbers.has(pokemonNumber));
      
      card[pos] = pokemonNumber;
      usedNumbers.add(pokemonNumber);
    }

    return card;
  }

  /**
   * Generate multiple bingo cards with different seeds
   */
  static generateMultipleCards(
    count: number, 
    baseSeed: number = Date.now()
  ): (number | string)[][] {
    const cards: (number | string)[][] = [];
    
    for (let i = 0; i < count; i++) {
      const seed = baseSeed + i;
      const generator = new SeedGenerator(seed);
      cards.push(generator.generateBingoCard());
    }
    
    return cards;
  }

  /**
   * Create a seed from a string (useful for consistent card generation)
   */
  static stringToSeed(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Generate a seed based on current date and time
   */
  static generateTimeSeed(): number {
    return Date.now();
  }

  /**
   * Generate a seed based on current date (same seed for same day)
   */
  static generateDateSeed(): number {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    return this.stringToSeed(dateString);
  }
}

/**
 * Utility functions for bingo card generation
 */
export const bingoUtils = {
  /**
   * Generate a single bingo card
   */
  generateCard(seed?: number): (number | string)[] {
    const finalSeed = seed || SeedGenerator.generateTimeSeed();
    const generator = new SeedGenerator(finalSeed);
    
    return generator.generateBingoCard();
  },

  /**
   * Generate multiple bingo cards
   */
  generateCards(count: number, baseSeed?: number): (number | string)[][] {
    const finalSeed = baseSeed || SeedGenerator.generateTimeSeed();
    return SeedGenerator.generateMultipleCards(count, finalSeed);
  },

  /**
   * Generate a card with a specific name as seed
   */
  generateCardByName(cardName: string): (number | string)[] {
    const seed = SeedGenerator.stringToSeed(cardName);
    const generator = new SeedGenerator(seed);
    return generator.generateBingoCard();
  },

  /**
   * Generate today's card (same for everyone on the same day)
   */
  generateTodaysCard(): (number | string)[] {
    const seed = SeedGenerator.generateDateSeed();
    const generator = new SeedGenerator(seed);
    return generator.generateBingoCard();
  }
};