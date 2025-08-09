import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { GameError, GameMessage } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State,
  self: LilliesDetermination, effect: TrainerEffect): IterableIterator<State> {

  const player = effect.player;

  // Do not play if supporter has been played
  if (player.supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  // Move hand to deck
  const cards = player.hand.cards.filter(c => c !== self);
  player.hand.moveCardsTo(cards, player.deck);


  yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
    next();
  });

  // Draw cards
  const cardsToDraw = player.getPrizeLeft() === 6 ? 8 : 6;
  player.deck.moveTo(player.hand, cardsToDraw);
  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  return state;
}


export class LilliesDetermination extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'M1L';
  public regulationMark = 'I';
  public setNumber: string = '62';
  public name: string = 'Lillie\'s Determination';
  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Lillie\'s Determination M1L';
  public text: string = 'Shuffle your hand into your deck. Then, draw 6 cards. If you have 6 prize cards remaining, draw 8 cards instead.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
