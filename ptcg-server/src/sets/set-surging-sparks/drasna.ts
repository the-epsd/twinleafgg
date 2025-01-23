import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { CoinFlipPrompt, GameMessage } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State,
  self: Drasna, effect: TrainerEffect): IterableIterator<State> {

  const player = effect.player;
  const cards = player.hand.cards.filter(c => c !== self);

  // Put hand in deck (except for Drasna, which will be discarded by default)
  if (cards.length > 0) { player.hand.moveCardsTo(cards, player.deck); }

  // Shuffle deck
  yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
    next();
  });

  // Flip coin and draw cards based on the result.
  yield store.prompt(state, [
    new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
  ], result => {
    player.deck.moveTo(player.hand, result ? 8 : 3);
    next();
  });

  return state;
}

export class Drasna extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SSP';

  public setNumber = '173';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Drasna';

  public fullName: string = 'Drasna SSP';

  public text: string =
    'Shuffle your hand into your deck. Then, flip a coin. If heads, draw 8 cards. If tails, draw 3 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
