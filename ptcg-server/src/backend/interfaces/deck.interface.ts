export interface DeckSaveRequest {
  id: number;
  name: string;
  cards: string[];
  manualArchetype1?: string;
  manualArchetype2?: string;
  artworks?: { code: string; artworkId?: number }[];
  sleeveIdentifier?: string;
  sleeveImagePath?: string;
}

export interface Deck {
  id: number;
  name: string;
  isValid: boolean;
  cards: string;
  cardTypes: string;
  manualArchetype1: string | null;
  manualArchetype2: string | null;
  sleeveIdentifier?: string;
  sleeveImagePath?: string;
}
