import { apiGet } from './client';

export type PlayerCoinItem = {
  identifier: string;
  name: string;
  imagePath: string;
  isDefault: boolean;
  sortOrder: number;
};

export function listCoins() {
  return apiGet<{ ok: boolean; coins: PlayerCoinItem[] }>('/v1/coins/list');
}
