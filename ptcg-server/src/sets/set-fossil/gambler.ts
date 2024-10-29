import { CoinFlipPrompt, GameMessage, ShuffleDeckPrompt, State, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class Gambler extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'FO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '60';

  public name: string = 'Gambler';

  public fullName: string = 'Gambler FO';

  public text: string =
    'Shuffle your hand into your deck. Flip a coin. If heads, draw 8 cards. If tails, draw 1 card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const cards = player.hand.cards.filter(c => c !== this);

      player.hand.moveCardsTo(cards, player.deck);
      store.prompt(state, [
        new ShuffleDeckPrompt(player.id),
      ], deckOrder => {
        player.deck.applyOrder(deckOrder);

        player.deck.moveTo(player.hand, 4);
      });
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        if (results) {
          player.deck.moveTo(player.hand, 8);
        } else {
          player.deck.moveTo(player.hand, 1);
        }
      });
      return state;
    }

    return state;
  }
}