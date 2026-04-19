import type { ServerConfig } from 'ptcg-server';
import { appConfig } from '../env/config';

/** Resolve avatar image URL the same way as Angular `ptcg-avatar`. */
export function resolveAvatarUrl(avatarFile: string | undefined, serverConfig: ServerConfig | null): string {
  if (!avatarFile) {
    return '';
  }
  const base64pattern = /^data:image\/([a-zA-Z]*);base64,/;
  const urlPattern = /^(https?|file):\/\//;
  if (base64pattern.test(avatarFile) || urlPattern.test(avatarFile)) {
    return avatarFile;
  }
  const avatarUrl = serverConfig?.avatarsUrl ?? '';
  return `${appConfig.apiUrl}${avatarUrl.replace('{name}', avatarFile)}`;
}
