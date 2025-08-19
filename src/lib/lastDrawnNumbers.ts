import lastDrawnNumbers from '../data/last-drawn-numbers.json';

export interface LastDrawnNumber {
    lastDrawnId: string;
    date: string;
}

export class LastDrawnNumberService {
    /**
     * Get all last drawn numbers
     */
    static getAll(): LastDrawnNumber[] {
        return lastDrawnNumbers as LastDrawnNumber[];
    }

    /**
     * Get all drawn IDs as a Set for efficient lookup
     */
    static getDrawnIds(): Set<string> {
        const drawnNumbers = this.getAll();
        return new Set(drawnNumbers.map(item => item.lastDrawnId));
    }

    /**
     * Check if a specific ID has been drawn
     */
    static isIdDrawn(id: string): boolean {
        return this.getDrawnIds().has(id);
    }
}