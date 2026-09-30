import type { Card } from 'ptcg-server';
import type { Board3dCardInfoData, Board3dCardsAdapter, CardInfoPaneActionResult } from './board3dCardsAdapter';
import { resolveScanUrl, type CardImageMaps } from '../../deck-editor/resolveScanUrl';
import { proxyImageUrlForWebGl } from '../../utils/proxyImageUrl';

function getScanUrlFromCardList(
  card: Card,
  cardList: unknown | undefined,
  maps: CardImageMaps,
  scansUrl: string | undefined,
  apiBase: string,
): string {
  if (!card || card.fullName === 'Unknown' || card.name === 'Unknown') {
    return '';
  }
  if (cardList) {
    const artworksMap = (cardList as { artworksMap?: { [code: string]: { imageUrl: string } } }).artworksMap;
    if (artworksMap?.[card.fullName]?.imageUrl) {
      return artworksMap[card.fullName].imageUrl;
    }
    const map = cardList as Record<string, { imageUrl?: string }>;
    if (map && map[card.fullName]?.imageUrl) {
      return map[card.fullName].imageUrl!;
    }
  }
  return resolveScanUrl(card, maps, scansUrl, apiBase);
}

function getScanUrlFor3D(
  card: Card,
  cardList: unknown | undefined,
  maps: CardImageMaps,
  scansUrl: string | undefined,
  apiBase: string,
): string {
  const baseUrl = getScanUrlFromCardList(card, cardList, maps, scansUrl, apiBase);
  if (!baseUrl?.trim()) {
    return baseUrl;
  }
  return proxyImageUrlForWebGl(baseUrl);
}

export function createBoard3dCardsAdapter(input: {
  maps: CardImageMaps;
  scansUrl: string | undefined;
  apiBase: string;
  sleevesUrl: string | undefined;
  deckBoxesUrl?: string | undefined;
  coinsUrl?: string | undefined;
  showCardInfo: (data: Board3dCardInfoData) => Promise<CardInfoPaneActionResult>;
  showCardInfoList: (data: Board3dCardInfoData) => Promise<CardInfoPaneActionResult>;
}): Board3dCardsAdapter {
  const { maps, scansUrl, apiBase, sleevesUrl, deckBoxesUrl, coinsUrl, showCardInfo, showCardInfoList } = input;

  return {
    getScanUrlFor3D(card: Card, cardList?: unknown): string {
      return getScanUrlFor3D(card, cardList, maps, scansUrl, apiBase);
    },
    getSleeveUrl(imagePath?: string): string | undefined {
      if (!imagePath) {
        return undefined;
      }
      const template = sleevesUrl ?? '/sleeves/{path}';
      const base = apiBase.replace(/\/$/, '');
      return base + template.replace('{path}', imagePath);
    },
    getDeckBoxUrl(imagePath?: string): string | undefined {
      const template = deckBoxesUrl ?? '/deck-boxes/{path}';
      const path = imagePath || 'basicblue.png';
      const base = apiBase.replace(/\/$/, '');
      return base + template.replace('{path}', path);
    },
    getCoinUrl(imagePath?: string): string | undefined {
      const template = coinsUrl ?? '/coins/{path}';
      const path = imagePath || 'twinleaf-coin.png';
      const base = apiBase.replace(/\/$/, '');
      return base + template.replace('{path}', path);
    },
    showCardInfo(data: Board3dCardInfoData = {}) {
      return showCardInfo(data);
    },
    showCardInfoList(data: Board3dCardInfoData = {}) {
      if (data.cardList === undefined) {
        return showCardInfo(data);
      }
      return showCardInfoList(data);
    },
  };
}
