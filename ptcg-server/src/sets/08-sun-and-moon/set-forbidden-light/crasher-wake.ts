import {
  Card,
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  Player,
  State,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: CrasherWake,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];

  if (player.supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  if (!self.canPlay(store, state, player)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      player.hand,
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
      { min: 2, max: 2, allowCancel: false },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  // Operation canceled by the user
  if (cards.length === 0) {
    return state;
  }

  MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: self });

  SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, self, {}, { min: 0, max: 2, allowCancel: false });
  return state;
}

export class CrasherWake extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name: string = 'Crasher Wake';
  public fullName: string = 'Crasher Wake FLI';
  public text: string =
    'Discard 2 [W] Energy cards from your hand. If you do, search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    const waterEnergyInHand = player.hand.cards.filter(
      (c) => c.superType === SuperType.ENERGY && c.name === 'Water Energy',
    ).length;
    if (waterEnergyInHand < 2) {
      return false;
    }
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
