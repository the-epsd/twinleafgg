import { Card } from '../../../game/store/card/card';
import { CardTag, EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardToHandEffect, TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { CardList } from '../../../game/store/state/card-list';
import { Player } from '../../../game';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: SuperiorEnergyRetrieval,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];

  cards = player.hand.cards.filter((c) => c !== self);
  if (cards.length < 2) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let basicEnergies = 0;
  player.discard.cards.forEach((c) => {
    if (c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC) {
      basicEnergies += 1;
    }
  });

  if (basicEnergies === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;

  const handTemp = new CardList();
  handTemp.cards = player.hand.cards.filter((c) => c !== self);

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      handTemp,
      {},
      { min: 2, max: 2, allowCancel: true },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  if (cards.length === 0) {
    return state;
  }

  let recovered: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.discard,
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { min: 1, max: 4, allowCancel: false },
    ),
    (selected) => {
      recovered = selected || [];
      next();
    },
  );

  if (recovered.length === 0) {
    return state;
  }

  MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: self });
  MOVE_CARDS(store, state, player.discard, player.hand, { cards: recovered, sourceCard: self });

  return state;
}

export class SuperiorEnergyRetrieval extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  protected _tags = [CardTag.ACE_SPEC];
  public set: string = 'PLF';
  public name: string = 'Superior Energy Retrieval';
  public fullName: string = 'Superior Energy Retrieval PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '103';
  public text: string =
    'You can use this card only if you discard 2 other cards from ' +
    'your hand.' +
    '' +
    'Put up to 4 Basic Energy cards from your discard pile into ' +
    "your hand. (You can't choose a card you discarded with the " +
    'effect of this card.)';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const otherCardsInHand = player.hand.cards.filter((c) => c !== this).length;
    if (otherCardsInHand < 2) {
      return false;
    }

    return player.discard.cards.some(
      (c) => c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC,
    );
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const discardEffect = new DiscardToHandEffect(player, this);
      store.reduceEffect(state, discardEffect);

      if (discardEffect.preventDefault) {
        return state;
      }

      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }
}
