import { apiGet } from './client';

export type PlayerDeckBoxItem = {
  identifier: string;
  name: string;
  imagePath: string;
  isDefault: boolean;
  sortOrder: number;
};

export function listDeckBoxes() {
  return apiGet<{ ok: boolean; deckBoxes: PlayerDeckBoxItem[] }>('/v1/deck-boxes/list');
}
