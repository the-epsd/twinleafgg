import type { CardsInfo } from 'ptcg-server';
import { CardManager, StateSerializer } from 'ptcg-server';

export function applyCardsInfoToGameEngine(cardsInfo: CardsInfo): void {
  const cm = CardManager.getInstance();
  cm.loadCardsInfo(cardsInfo);
  StateSerializer.setKnownCards(cm.getAllCards().slice());
}

export function clearGameEngineCards(): void {
  StateSerializer.setKnownCards([]);
}
