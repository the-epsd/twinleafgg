import { apiGet, apiPost } from './client';
import type { Format } from 'ptcg-server';
import type { DeckListResponse, DeckResponse, OkResponse } from '../types/responses';

export interface DeckListParams {
  summary?: boolean;
  limit?: number;
  offset?: number;
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

export function getDeck(deckId: number): Promise<DeckResponse> {
  return apiGet<DeckResponse>(`/v1/decks/get/${deckId}`);
}

export function createDeck(name: string): Promise<DeckResponse> {
  return apiPost<DeckResponse>('/v1/decks/save', { name, cards: [] });
}

export function saveDeck(
  deckId: number,
  name: string,
  cards: string[],
  artworks?: { code: string; artworkId?: number }[]
): Promise<DeckResponse> {
  return apiPost<DeckResponse>('/v1/decks/save', {
    id: deckId,
    name,
    cards,
    ...(artworks ? { artworks } : {}),
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
