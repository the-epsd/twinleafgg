import type {
  Card,
  CardsInfo,
  ServerConfig,
  UserInfo,
} from 'ptcg-server';
import type { Archetype, CardTag, CardType, Format } from 'ptcg-server';

export interface OkResponse {
  ok: boolean | number;
}

export interface LoginResponseBody extends OkResponse {
  token: string;
  config: ServerConfig;
  user: UserInfo;
}

export interface CardsHashResponse extends OkResponse {
  cardsTotal: number;
  hash: string;
}

export interface CardsResponse extends OkResponse {
  cards: Card[];
  cardsInfo: CardsInfo;
}

export interface DeckListEntry {
  id: number;
  name: string;
  cardType?: CardType[];
  cardTag?: CardTag[];
  cards?: string[];
  format: Format[];
  isValid: boolean;
  manualArchetype1?: Archetype;
  manualArchetype2?: Archetype;
  artworks?: { code: string; artworkId?: number }[];
}

export interface DeckListResponse extends OkResponse {
  decks: DeckListEntry[];
  total?: number;
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
}

export interface DeckResponse extends OkResponse {
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

export interface DeckStatsResponse extends OkResponse {
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
