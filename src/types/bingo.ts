export interface BingoCard {
  id: string;
  name: string;
  pokemons: (number | string)[];
  markedPositions: number[];
  createdAt: Date;
}

export interface BingoCardFormData {
  name: string;
  pokemons: (number | string)[];
}
