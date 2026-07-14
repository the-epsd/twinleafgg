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
import { getCardImagesUrl, getNightlyImagesUrl } from '../api/profileApi';
import { appConfig } from '../env/config';
import {
  mergeImageRecords,
  persistCustomImages,
  persistNightlyImages,
  readCardImageMapsFromStorage,
  resolveScanUrl,
  type CardImageMaps,
} from '../deck-editor/resolveScanUrl';
import { useAuth } from './AuthContext';

type CardImagesContextValue = {
  maps: CardImageMaps;
  refreshFromStorage: () => void;
};

const CardImagesContext = createContext<CardImagesContextValue | null>(null);

async function fetchJsonRecord(url: string): Promise<Record<string, string> | null> {
  const res = await fetch(url);
  if (!res.ok) {
    return null;
  }
  const j: unknown = await res.json();
  if (j && typeof j === 'object' && !Array.isArray(j)) {
    return j as Record<string, string>;
  }
  return null;
}

export function CardImagesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [maps, setMaps] = useState<CardImageMaps>(() => readCardImageMapsFromStorage());

  const refreshFromStorage = useCallback(() => {
    setMaps(readCardImageMapsFromStorage());
  }, []);

  useEffect(() => {
    const base = readCardImageMapsFromStorage();
    if (!isAuthenticated) {
      setMaps(base);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const [imgRes, nightRes] = await Promise.all([
          getCardImagesUrl().catch(() => ({ ok: true, jsonUrl: '' })),
          getNightlyImagesUrl().catch(() => ({ ok: true, jsonUrl: '' })),
        ]);

        let custom = { ...base.custom };
        let nightly = { ...base.nightly };

        const imgUrl = imgRes.jsonUrl?.trim();
        if (imgUrl) {
          const j = await fetchJsonRecord(imgUrl);
          if (!cancelled && j) {
            custom = mergeImageRecords(custom, j);
            persistCustomImages(custom);
          }
        }

        const nightUrl = nightRes.jsonUrl?.trim();
        if (nightUrl) {
          const j = await fetchJsonRecord(nightUrl);
          if (!cancelled && j) {
            nightly = mergeImageRecords(nightly, j);
            persistNightlyImages(nightly);
          }
        }

        if (!cancelled) {
          setMaps({
            custom,
            nightly,
            overrides: readCardImageMapsFromStorage().overrides,
          });
        }
      } catch {
        if (!cancelled) {
          setMaps(readCardImageMapsFromStorage());
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

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
 * Resolves card art URLs like Angular CardsBaseService.getScanUrl (maps + server scansUrl).
 */
export function useCardImageMaps(): CardImageMaps {
  const c = useContext(CardImagesContext);
  return c?.maps ?? readCardImageMapsFromStorage();
}

export function useCardImagesRefresh(): () => void {
  const c = useContext(CardImagesContext);
  return c?.refreshFromStorage ?? (() => {});
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
