export interface DeckSaveRequest {
    id: number;
    name: string;
    cards: string[];
}
export interface Deck {
    id: number;
    name: string;
    isValid: boolean;
    cards: string;
    cardTypes: string;
}
