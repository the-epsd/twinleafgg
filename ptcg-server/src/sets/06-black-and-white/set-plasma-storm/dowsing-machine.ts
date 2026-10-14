import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, CardTag, SuperType } from '../../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, Player, Card, ChooseCardsPrompt } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardToHandEffect, TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { CardList } from '../../../game/store/state/card-list';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: DowsingMachine,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];

  MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [effect.trainerCard], sourceCard: self });
  effect.preventDefault = true;

  const handTemp = new CardList();
  handTemp.cards = player.hand.cards.filter((c) => c !== self);

  cards = [];
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
      { superType: SuperType.TRAINER },
      { min: 1, max: 1, allowCancel: true },
    ),
    (selected) => {
      recovered = selected || [];
      next();
    },
  );

  if (recovered.length === 0) {
    return state;
  }

  MOVE_CARDS(store, state, player.hand, player.discard, { cards: [self], sourceCard: self });
  MOVE_CARDS(store, state, player.hand, player.discard, { cards: cards, sourceCard: self });
  MOVE_CARDS(store, state, player.discard, player.hand, { cards: recovered, sourceCard: self });

  return state;
}

export class DowsingMachine extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  protected _tags = [CardTag.ACE_SPEC];
  public set: string = 'PLS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '128';
  public name: string = 'Dowsing Machine';
  public fullName: string = 'Dowsing Machine PLS';
  public text: string =
    "Discard 2 cards from your hand. (If you can't discard 2 cards, " +
    "you can't play this card.) Put a Trainer card from your discard " +
    'pile into your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const cardsInHand = player.hand.cards.filter((c) => c !== this);
    if (cardsInHand.length < 2) {
      return false;
    }
    const hasTrainerInDiscard = player.discard.cards.some((c) => c instanceof TrainerCard);
    return hasTrainerInDiscard;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const discardEffect = new DiscardToHandEffect(player, this);
      store.reduceEffect(state, discardEffect);

      if (discardEffect.preventDefault) {
        return state;
      }

      const cardsInHand = player.hand.cards.filter((c) => c !== this);
      if (cardsInHand.length < 2) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const hasTrainerInDiscard = player.discard.cards.some((c) => c instanceof TrainerCard);
      if (!hasTrainerInDiscard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }
}
