import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { Card } from '../../game';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';

function* playCard(next: Function, store: StoreLike, state: State,
  effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];
  console.log('we in');

  if (player.hand.cards.length <= 1) {
    console.log('you apparently don\'t have enough cards');
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    player.hand,
    {},
    { allowCancel: false, min: 2, max: 2 }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.hand.moveCardsTo(cards, player.discard);
  player.deck.moveTo(player.hand, 4);
}

export class Sophocles extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BUS';

  public setNumber = '123';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Sophocles';

  public fullName: string = 'Sophocles BUS';

  public text: string =
    'Discard 2 cards from your hand. If you do, draw 4 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      console.log('it did reach this');
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
