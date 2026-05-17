import type { TFunction } from './strings';
import { hasTranslation } from './strings';

/**
 * Map server game error strings (GameMessage enum values) to localized copy.
 */
export function translateGameSocketError(t: TFunction, rawMessage: string): string {
  const key = `GAME_MESSAGES.${rawMessage}`;
  if (hasTranslation(key)) {
    return t(key);
  }
  return t('ERROR_UNKNOWN');
}
