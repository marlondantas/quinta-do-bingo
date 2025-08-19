// Types for analytics data
interface CardCreationData {
  id: string;
  name: string;
  timestamp: string;
}

interface CellMarkingData {
  cardId: string;
  cardName: string;
  pokemons: (number | string)[];
  markedPositions: number[];
  lastMarkedPosition: number | null;
  timestamp: string;
}

interface AnalyticsEvent {
  type: 'CARD_CREATED' | 'CELL_MARKED';
  [key: string]: unknown;
}

interface QueueItem {
  endpoint: string;
  data: AnalyticsEvent;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private queue: QueueItem[] = [];
  private isProcessing = false;
  private markingTimeouts = new Map<string, NodeJS.Timeout>();

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private hasConsent(): boolean {
    return localStorage.getItem('bingo-privacy-accepted') === 'true';
  }

  async trackCardCreation(cardData: CardCreationData): Promise<void> {
    if (!this.hasConsent()) {
      console.log('Analytics tracking skipped - no consent');
      return;
    }

    this.enqueue('/api/analytics/card-created', {
      type: 'CARD_CREATED',
      ...cardData
    });
  }

  // Versão atualizada para sua estrutura de dados
  async trackCellMarking(data: CellMarkingData): Promise<void> {
    if (!this.hasConsent()) {
      console.log('Analytics tracking skipped - no consent');
      return;
    }

    // Debounce rapid marking to avoid spam
    const key = data.cardId;
    
    if (this.markingTimeouts.has(key)) {
      clearTimeout(this.markingTimeouts.get(key)!);
    }

    this.markingTimeouts.set(key, setTimeout(() => {
      this.enqueue('/api/analytics/cell-marked', {
        type: 'CELL_MARKED',
        ...data
      });
      this.markingTimeouts.delete(key);
    }, 1000));
  }

  private enqueue(endpoint: string, data: AnalyticsEvent): void {
    this.queue.push({ endpoint, data });
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift()!;
      
      try {
        await fetch(item.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data)
        });
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.isProcessing = false;
  }
}

export const analytics = AnalyticsService.getInstance();