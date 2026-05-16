import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Card } from 'ptcg-server';
import { appConfig } from '../env/config';
import { apiGet } from '../api/client';
import {
  mergeImageRecords,
  persistNightlyImages,
  readCardImageMapsFromStorage,
  resolveScanUrl,
  type CardImageMaps,
} from '../deck-editor/resolveScanUrl';

type CardImagesContextValue = {
  maps: CardImageMaps;
  refreshFromStorage: () => void;
};

const CardImagesContext = createContext<CardImagesContextValue | null>(null);

async function getServerCardImageMap(): Promise<Record<string, string>> {
  const res = await apiGet<{ ok: true; images: Record<string, string> }>('/v1/cards/image-map', { skipAuth: true });
  return res.images;
}

export function CardImagesProvider({ children }: { children: ReactNode }) {
  const [maps, setMaps] = useState<CardImageMaps>(() => readCardImageMapsFromStorage());

  const refreshFromStorage = useCallback(() => {
    setMaps(readCardImageMapsFromStorage());
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const base = readCardImageMapsFromStorage();
      try {
        const fetched = await getServerCardImageMap();
        if (cancelled) {
          return;
        }
        const nightly = mergeImageRecords(base.nightly, fetched);
        persistNightlyImages(nightly);
        setMaps({ ...base, nightly });
      } catch {
        if (!cancelled) {
          setMaps(base);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<CardImagesContextValue>(
    () => ({
      maps,
      refreshFromStorage,
    }),
    [maps, refreshFromStorage],
  );

  return <CardImagesContext.Provider value={value}>{children}</CardImagesContext.Provider>;
}

/**
 * Resolves card art URLs from local maps and the server scansUrl template.
 */
export function useCardImageMaps(): CardImageMaps {
  const c = useContext(CardImagesContext);
  return c?.maps ?? readCardImageMapsFromStorage();
}

export function useDeckCardScanUrl(scansUrl: string | undefined): (card: Card) => string {
  const ctx = useContext(CardImagesContext);
  const maps = ctx?.maps ?? readCardImageMapsFromStorage();
  const apiBase = appConfig.apiUrl;
  return useCallback(
    (card: Card) => resolveScanUrl(card, maps, scansUrl, apiBase),
    [maps, scansUrl, apiBase],
  );
}
