import { apiGet } from './client';

export type PlayerSleeveItem = {
  identifier: string;
  name: string;
  imagePath: string;
  isDefault: boolean;
  sortOrder: number;
};

export function listSleeves() {
  return apiGet<{ ok: boolean; sleeves: PlayerSleeveItem[] }>('/v1/sleeves/list');
}
