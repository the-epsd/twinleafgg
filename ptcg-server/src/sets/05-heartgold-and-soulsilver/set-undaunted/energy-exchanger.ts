import { Card, ChooseCardsPrompt, GameError, GameMessage, Player, State, StateUtils, StoreLike, TrainerCard } from '../../../game';
import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import {
  MOVE_CARDS,
  SEARCH_DECK_FOR_CARDS_TO_HAND,
  SHOW_CARDS_TO_PLAYER,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function hasEnergyInHand(player: Player): boolean {
  return player.hand.cards.some((c) => c.superType === SuperType.ENERGY);
}

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: EnergyExchanger,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (!hasEnergyInHand(player)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DECK,
      player.hand,
      { superType: SuperType.ENERGY },
      { min: 1, max: 1, allowCancel: true },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  if (cards.length === 0) {
    return;
  }

  MOVE_CARDS(store, state, player.hand, player.deck, {
    cards,
    toTop: true,
    sourceCard: self,
  });

  SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);

  SEARCH_DECK_FOR_CARDS_TO_HAND(
    store,
    state,
    player,
    self,
    { superType: SuperType.ENERGY },
    { min: 0, max: 1, allowCancel: true },
    effect,
  );
}

export class EnergyExchanger extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'UD';
  public name: string = 'Energy Exchanger';
  public fullName: string = 'Energy Exchanger UD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
  public text: string =
    'Choose an Energy card from your hand, show it to your opponent, and put it on top of your deck. Search your deck for an Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    return hasEnergyInHand(player);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
