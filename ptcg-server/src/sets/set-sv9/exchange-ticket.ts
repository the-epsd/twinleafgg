import { Card, GameError, GameMessage, State, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class ExchangeTicket extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'I';

  public set: string = 'SV9';

  public name: string = 'Exchange Ticket';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '90';

  public fullName: string = 'Exchange Ticket SV9';

  public text: string =
    'Count your Prize cards and shuffle them face down, then put them at the bottom of your deck. If you do, add that many cards from the top of your deck to your Prize cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const prizes = player.prizes.filter(p => p.cards.length > 0);
      const prizeCount = prizes.reduce((sum, p) => sum + p.cards.length, 0);

      if (prizeCount === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Move the trainer card to discard
      player.hand.moveCardTo(effect.trainerCard, player.discard);

      // Collect all prize cards
      const allPrizeCards: Card[] = [];
      prizes.forEach(p => allPrizeCards.push(...p.cards));

      // Shuffle the prize cards
      this.shuffleArray(allPrizeCards);

      // Move prize cards to the bottom of the deck
      allPrizeCards.forEach(card => {
        player.deck.cards.unshift(card);
      });

      // Clear the prize cards
      prizes.forEach(p => p.cards = []);

      // Draw cards from the top of the deck to the prize cards
      for (let i = 0; i < prizeCount; i++) {
        const card = player.deck.cards.pop();
        if (card) {
          const prize = player.prizes.find(p => p.cards.length === 0);
          if (prize) {
            prize.cards.push(card);
          } else {
            player.deck.cards.push(card);
          }
        }
      }

      // Set the new prize cards to be face down
      player.prizes.forEach(p => p.isSecret = true);
      player.supporter.moveCardTo(this, player.discard);
      return state;
    }

    return state;
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}