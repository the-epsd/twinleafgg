import { apiGet, apiPost } from './client';
import type { Archetype, Format } from 'ptcg-server';
import type { DeckListEntry, DeckListResponse, DeckResponse, DeckStatsResponse, OkResponse } from '../types/responses';

export interface DeckListParams {
  summary?: boolean;
  limit?: number;
  offset?: number;
}

const DECK_LIST_PAGE_LIMIT = 500;

function mergeDeckLists(accumulated: DeckListEntry[], newDecks: DeckListEntry[]): DeckListEntry[] {
  const existingIds = new Set(accumulated.map((d) => d.id));
  return [...accumulated, ...newDecks.filter((d) => !existingIds.has(d.id))];
}

export function getDeckList(params?: DeckListParams): Promise<DeckListResponse> {
  const search = new URLSearchParams();
  if (params?.summary) {
    search.set('summary', 'true');
  }
  if (params?.limit !== undefined) {
    search.set('limit', String(params.limit));
  }
  if (params?.offset !== undefined) {
    search.set('offset', String(params.offset));
  }
  const q = search.toString();
  return apiGet<DeckListResponse>(`/v1/decks/list${q ? `?${q}` : ''}`);
}

export async function fetchAllDecks(options?: { summary?: boolean }): Promise<DeckListEntry[]> {
  const summary = options?.summary ?? true;
  let accumulated: DeckListEntry[] = [];
  let offset = 0;

  while (true) {
    const response = await getDeckList({ summary, limit: DECK_LIST_PAGE_LIMIT, offset });
    accumulated = mergeDeckLists(accumulated, response.decks);
    const total = response.total ?? accumulated.length;
    offset += DECK_LIST_PAGE_LIMIT;
    if (offset >= total || response.decks.length < DECK_LIST_PAGE_LIMIT) {
      return accumulated;
    }
  }
}

export function getDeck(deckId: number): Promise<DeckResponse> {
  return apiGet<DeckResponse>(`/v1/decks/get/${deckId}`);
}

export function getDeckStats(deckId: number, replayLimit?: number): Promise<DeckStatsResponse> {
  const search = new URLSearchParams();
  if (replayLimit !== undefined) {
    search.set('limit', String(replayLimit));
  }
  const q = search.toString();
  return apiGet<DeckStatsResponse>(`/v1/decks/stats/${deckId}${q ? `?${q}` : ''}`);
}

export function createDeck(name: string): Promise<DeckResponse> {
  return apiPost<DeckResponse>('/v1/decks/save', { name, cards: [] });
}

export function saveDeck(
  deckId: number,
  name: string,
  cards: string[],
  manualArchetype1?: Archetype,
  manualArchetype2?: Archetype,
  artworks?: { code: string; artworkId?: number }[],
  sleeveIdentifier?: string
): Promise<DeckResponse> {
  return apiPost<DeckResponse>('/v1/decks/save', {
    id: deckId,
    name,
    cards,
    manualArchetype1,
    manualArchetype2,
    ...(artworks ? { artworks } : {}),
    ...(sleeveIdentifier ? { sleeveIdentifier } : {}),
  });
}

export function deleteDeck(deckId: number): Promise<OkResponse> {
  return apiPost<OkResponse>('/v1/decks/delete', { id: deckId });
}

export function renameDeck(deckId: number, name: string): Promise<OkResponse & { deck?: { id: number; name: string } }> {
  return apiPost<OkResponse & { deck?: { id: number; name: string } }>('/v1/decks/rename', { id: deckId, name });
}

export function duplicateDeck(deckId: number, name: string): Promise<DeckResponse> {
  return apiPost<DeckResponse>('/v1/decks/duplicate', { id: deckId, name });
}

export function validateFormatsForCards(cardNames: string[]): Promise<{ formats: Format[] }> {
  return apiPost<{ formats: Format[] }>('/v1/decks/validate-formats', { cardNames });
}
