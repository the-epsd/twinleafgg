export interface DeckSaveRequest {
  id: number;
  name: string;
  cards: string[];
  sleeveFile?: string;
}
