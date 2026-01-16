import { CardTag, CardType, Format, Archetype } from 'ptcg-server';
import { Response } from './response.interface';
import { DeckItem } from 'src/app/deck/deck-card/deck-card.interface';

export interface DeckListEntry {
  id: number;
  name: string;
  cardType: CardType[];
  cardTag: CardTag[];
  cards: string[];
  format: Format[];
  isValid: boolean;
  deckItems: DeckItem[];
  manualArchetype1?: Archetype;
  manualArchetype2?: Archetype;
  artworks?: { code: string; artworkId?: number }[];
  sleeveIdentifier?: string;
  sleeveImagePath?: string;
}

export interface DeckListResponse extends Response {
  decks: DeckListEntry[];
}

export interface Deck {
  id: number;
  name: string;
  cardType: CardType[];
  cardTag: CardTag[];
  format: Format[];
  isValid: boolean;
  cards: string[];
  manualArchetype1?: Archetype;
  manualArchetype2?: Archetype;
  artworks?: { code: string; artworkId?: number }[];
  sleeveIdentifier?: string;
  sleeveImagePath?: string;
}

export interface DeckResponse extends Response {
  deck: Deck;
}

export interface DeckStatsMatchup {
  archetype: string;
  games: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface DeckStatsReplay {
  matchId: number;
  opponentName: string;
  opponentId: number;
  winner: number;
  created: number;
  won: boolean;
}

export interface DeckStatsResponse extends Response {
  deckId: number;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  matchups: DeckStatsMatchup[];
  replays: DeckStatsReplay[];
  replayLimit?: number;
  totalReplays?: number;
}
