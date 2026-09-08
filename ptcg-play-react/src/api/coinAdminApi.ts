import { apiDelete, apiGet, apiPost, apiPut, apiUpload } from './client';
import type { CoinCatalogItem } from '../types/battlePass';

export function adminListCoins() {
  return apiGet<{ ok: boolean; coins: CoinCatalogItem[] }>('/v1/admin/coins/list');
}

export function adminCreateCoin(body: {
  identifier: string;
  name: string;
  imagePath: string;
  isDefault?: boolean;
  requiresUnlock?: boolean;
  sortOrder?: number;
}) {
  return apiPost<{ ok: boolean; coin: CoinCatalogItem }>('/v1/admin/coins/create', body);
}

export function adminUpdateCoin(
  id: number,
  body: Partial<{
    identifier: string;
    name: string;
    imagePath: string;
    isDefault: boolean;
    requiresUnlock: boolean;
    sortOrder: number;
  }>
) {
  return apiPut<{ ok: boolean; coin: CoinCatalogItem }>(`/v1/admin/coins/${id}`, body);
}

export function adminDeleteCoin(id: number) {
  return apiDelete<{ ok: boolean }>(`/v1/admin/coins/${id}`);
}

export function adminUploadCoinImage(file: File) {
  const form = new FormData();
  form.append('image', file);
  return apiUpload<{ ok: boolean; imagePath: string }>('/v1/admin/coins/upload', form);
}
