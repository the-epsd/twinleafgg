import { apiDelete, apiGet, apiPost, apiPut, apiUpload } from './client';
import type { SleeveCatalogItem } from '../types/battlePass';

export function adminListSleeves() {
  return apiGet<{ ok: boolean; sleeves: SleeveCatalogItem[] }>('/v1/admin/sleeves/list');
}

export function adminCreateSleeve(body: {
  identifier: string;
  name: string;
  imagePath: string;
  isDefault?: boolean;
  requiresUnlock?: boolean;
  sortOrder?: number;
}) {
  return apiPost<{ ok: boolean; sleeve: SleeveCatalogItem }>('/v1/admin/sleeves/create', body);
}

export function adminUpdateSleeve(
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
  return apiPut<{ ok: boolean; sleeve: SleeveCatalogItem }>(`/v1/admin/sleeves/${id}`, body);
}

export function adminDeleteSleeve(id: number) {
  return apiDelete<{ ok: boolean }>(`/v1/admin/sleeves/${id}`);
}

export function adminUploadSleeveImage(file: File) {
  const form = new FormData();
  form.append('image', file);
  return apiUpload<{ ok: boolean; imagePath: string }>('/v1/admin/sleeves/upload', form);
}
