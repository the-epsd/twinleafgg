import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChooseCardsPrompt, CardList, Player } from '../../../game';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;

  const max = player.hand.cards.length;

  return store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.hand,
      {},
      { min: 1, max: max, allowCancel: false },
    ),
    (selected) => {
      const selectedLength = selected.length;
      const deckTop = new CardList();

      MOVE_CARDS(store, state, player.hand, deckTop, {
        cards: selected,
        sourceCard: effect.trainerCard,
      });
      MOVE_CARDS(store, state, deckTop, player.deck, { sourceCard: effect.trainerCard });

      MOVE_CARDS(store, state, player.deck, player.hand, {
        count: selectedLength,
        sourceCard: effect.trainerCard,
      });
    },
  );
}

export class Caitlin extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'E';
  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '132';
  public name: string = 'Caitlin';
  public fullName: string = 'Caitlin CRE';
  public text: string =
    'Put as many cards from your hand as you like on the bottom of your deck in any order. Then, draw a card for each card you put on the bottom of your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    // Need at least one other card in hand to put on the bottom of the deck
    if (player.hand.cards.length <= 1) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
