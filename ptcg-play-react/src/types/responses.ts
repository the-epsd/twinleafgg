import type {
  Card,
  CardsInfo,
  ServerConfig,
  UserInfo,
} from 'ptcg-server';
import type { CardTag, CardType, Format } from 'ptcg-server';

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
  artworks?: { code: string; artworkId?: number }[];
}

export interface DeckResponse extends OkResponse {
  deck: Deck;
}
