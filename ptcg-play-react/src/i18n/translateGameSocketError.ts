import type { TFunction } from 'i18next';
import i18n from './i18n';

/**
 * Map server game error strings (GameMessage enum values) to localized copy.
 */
export function translateGameSocketError(t: TFunction, rawMessage: string): string {
  const key = `GAME_MESSAGES.${rawMessage}`;
  if (i18n.exists(key)) {
    return t(key);
  }
  return t('ERROR_UNKNOWN');
}
