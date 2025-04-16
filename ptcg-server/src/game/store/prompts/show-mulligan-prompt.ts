import { ShowCardsPrompt } from './show-cards-prompt';
import { GameMessage } from '../../game-message';
import { Card } from '../card/card';

export class ShowMulliganPrompt extends ShowCardsPrompt {
  public mulliganCards: Card[][]; // Store mulligan cards separately

  constructor(
    playerId: number,
    message: GameMessage,
    mulliganCards: Card[][], // Array of arrays to show each mulligan's cards
    options?: { allowCancel: boolean }
  ) {
    super(playerId, message, mulliganCards.flat(), options);
    this.mulliganCards = mulliganCards;
  }
} 