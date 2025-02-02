import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CardList } from '../../game/store/state/card-list';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length < 3) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  const deckBottom = new CardList();
  player.deck.moveTo(deckBottom, 3);

  return store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARDS_ORDER,
    deckBottom,
    {},
    { min: 3, max: 3, allowCancel: false }
  ), selected => {
    deckBottom.moveCardsTo(selected, player.deck);

    player.supporter.moveCardTo(effect.trainerCard, player.discard);
  });
}

export class ExpeditionUniform extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '137';

  public regulationMark = 'E';

  public name: string = 'Expedition Uniform';

  public fullName: string = 'Expedition Uniform CRE';

  public text: string =
    'Look at the bottom 3 cards of your deck and put them on top of your deck in any order.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
