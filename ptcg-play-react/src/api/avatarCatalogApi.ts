import { apiDelete, apiGet, apiPost, apiPut, apiUpload } from './client';
import type { AvatarCatalogItem } from '../types/battlePass';

export function adminListAvatars() {
  return apiGet<{ ok: boolean; avatars: AvatarCatalogItem[] }>('/v1/admin/avatars/list');
}

export function adminCreateAvatar(body: {
  identifier: string;
  name: string;
  fileName: string;
  isDefault?: boolean;
  sortOrder?: number;
}) {
  return apiPost<{ ok: boolean; avatar: AvatarCatalogItem }>('/v1/admin/avatars/create', body);
}

export function adminUpdateAvatar(
  id: number,
  body: Partial<{ identifier: string; name: string; fileName: string; isDefault: boolean; sortOrder: number }>
) {
  return apiPut<{ ok: boolean; avatar: AvatarCatalogItem }>(`/v1/admin/avatars/${id}`, body);
}

export function adminDeleteAvatar(id: number) {
  return apiDelete<{ ok: boolean }>(`/v1/admin/avatars/${id}`);
}

export function adminUploadAvatarImage(file: File) {
  const form = new FormData();
  form.append('image', file);
  return apiUpload<{ ok: boolean; fileName: string }>('/v1/admin/avatars/upload', form);
}
