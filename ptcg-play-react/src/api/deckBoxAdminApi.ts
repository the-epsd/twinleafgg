import { apiDelete, apiGet, apiPost, apiPut, apiUpload } from './client';
import type { DeckBoxCatalogItem } from '../types/battlePass';

export function adminListDeckBoxes() {
  return apiGet<{ ok: boolean; deckBoxes: DeckBoxCatalogItem[] }>('/v1/admin/deck-boxes/list');
}

export function adminCreateDeckBox(body: {
  identifier: string;
  name: string;
  imagePath: string;
  isDefault?: boolean;
  requiresUnlock?: boolean;
  sortOrder?: number;
}) {
  return apiPost<{ ok: boolean; deckBox: DeckBoxCatalogItem }>('/v1/admin/deck-boxes/create', body);
}

export function adminUpdateDeckBox(
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
  return apiPut<{ ok: boolean; deckBox: DeckBoxCatalogItem }>(`/v1/admin/deck-boxes/${id}`, body);
}

export function adminDeleteDeckBox(id: number) {
  return apiDelete<{ ok: boolean }>(`/v1/admin/deck-boxes/${id}`);
}

export function adminUploadDeckBoxImage(file: File) {
  const form = new FormData();
  form.append('image', file);
  return apiUpload<{ ok: boolean; imagePath: string }>('/v1/admin/deck-boxes/upload', form);
}
