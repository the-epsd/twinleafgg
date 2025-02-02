import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GameError, GameMessage } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State,
  self: Katy, effect: TrainerEffect): IterableIterator<State> {

  const player = effect.player;
  const cards = player.hand.cards.filter(c => c !== self);

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  if (cards.length > 0) {
    player.hand.moveCardsTo(cards, player.deck);

    yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
      player.deck.applyOrder(order);
      next();
    });
  }

  player.deck.moveTo(player.hand, 8);
  player.supporter.moveCardTo(effect.trainerCard, player.discard);

  const endTurnEffect = new EndTurnEffect(player);
  store.reduceEffect(state, endTurnEffect);
  return state;
}

export class Katy extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'G';

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '177';

  public name: string = 'Katy';

  public fullName: string = 'Katy SVI';

  public text: string =
    'Shuffle your hand into your deck. Then, draw 8 cards. Your turn ends.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
