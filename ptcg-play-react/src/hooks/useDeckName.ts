import { useEffect, useState } from 'react';
import { getDeck } from '../api/deckApi';

const deckNameCache = new Map<number, string>();

/**
 * Resolves a deck display name by id (cached for the session).
 */
export function useDeckName(deckId: number | undefined): string | undefined {
  const [name, setName] = useState<string | undefined>(() =>
    deckId != null ? deckNameCache.get(deckId) : undefined,
  );

  useEffect(() => {
    if (deckId == null) {
      setName(undefined);
      return;
    }
    const cached = deckNameCache.get(deckId);
    if (cached) {
      setName(cached);
      return;
    }
    let cancelled = false;
    void getDeck(deckId)
      .then((res) => {
        if (cancelled) {
          return;
        }
        const deckName = res.deck.name?.trim();
        if (deckName) {
          deckNameCache.set(deckId, deckName);
          setName(deckName);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setName(undefined);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [deckId]);

  return name;
}
