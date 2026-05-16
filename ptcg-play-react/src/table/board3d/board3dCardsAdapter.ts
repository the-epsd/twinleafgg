import type { Card, CardList, Player } from 'ptcg-server';
import type { CardInfoPaneOptions, CardInfoTableAction } from '../../card-info/CardInfoPane';

/** Data shape passed into card information popups. */
export type Board3dCardInfoData = {
  card?: Card;
  cardList?: CardList;
  options?: CardInfoPaneOptions;
  allowReveal?: boolean;
  facedown?: boolean;
  players?: Player[];
};

export type CardInfoPaneActionResult = (CardInfoTableAction & { cardList?: CardList }) | undefined;

/**
 * Card lookup and popup adapter used by the 3D board.
 */
export interface Board3dCardsAdapter {
  getScanUrlFor3D(card: Card, cardList?: unknown): string;
  showCardInfo(data?: Board3dCardInfoData): Promise<CardInfoPaneActionResult>;
  showCardInfoList(data?: Board3dCardInfoData): Promise<CardInfoPaneActionResult>;
}
