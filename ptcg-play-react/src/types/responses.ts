import type {
  Card,
  CardsInfo,
  ConversationInfo,
  MatchInfo,
  MessageInfo,
  ServerConfig,
  UserInfo,
} from 'ptcg-server';
import type { RankingInfo } from 'ptcg-server';
import type { Archetype, CardTag, CardType, Format, SuperType } from 'ptcg-server';

export interface OkResponse {
  ok: boolean | number;
}

/** Runtime class-inheritance edge from GET /v1/cards/parent-map. */
export interface CardParentMapEntry {
  fullName: string;
  name: string;
  set: string;
  setNumber: string;
  className: string;
  parentClassName: string | null;
  parentFullName: string | null;
  regulationMark?: string;
  superType: SuperType;
}

export interface CardParentMap {
  entries: CardParentMapEntry[];
}

export interface LoginResponseBody extends OkResponse {
  token: string;
  config: ServerConfig;
  user?: { id: number; name: string; roleId: number };
}

export interface ProfileResponse extends OkResponse {
  user: UserInfo;
}

export interface ProfileJsonUrlResponse extends OkResponse {
  jsonUrl: string;
}

export interface MatchHistoryResponse extends OkResponse {
  matches: MatchInfo[];
  users: UserInfo[];
  total: number;
}

export interface CardsHashResponse extends OkResponse {
  cardsTotal: number;
  hash: string;
}

export interface CardsResponse extends OkResponse {
  cards: Card[];
  cardsInfo: CardsInfo;
}

export interface CardsParentMapResponse extends OkResponse {
  parentMap: CardParentMap;
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
  sleeveIdentifier?: string;
  sleeveImagePath?: string;
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
  sleeveIdentifier?: string;
  sleeveImagePath?: string;
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

export interface RankingResponse extends OkResponse {
  ranking: RankingInfo[];
  total: number;
}

export interface ConversationsResponse extends OkResponse {
  conversations: ConversationInfo[];
  users: UserInfo[];
  total: number;
}

export interface MessagesResponse extends OkResponse {
  messages: MessageInfo[];
  users: UserInfo[];
  total: number;
}

/** Ack payload for `message:send` socket. */
export interface MessageSendAck {
  message: MessageInfo;
  user: UserInfo;
}
