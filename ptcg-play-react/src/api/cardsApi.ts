import { apiGet } from './client';
import type { CardsHashResponse, CardsResponse } from '../types/responses';

export function getCardsHash(): Promise<CardsHashResponse> {
  return apiGet<CardsHashResponse>('/v1/cards/hash');
}

export function getCardsAll(): Promise<CardsResponse> {
  return apiGet<CardsResponse>('/v1/cards/all');
}
