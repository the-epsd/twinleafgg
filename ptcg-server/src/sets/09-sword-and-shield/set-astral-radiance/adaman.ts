import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, SuperType, EnergyType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { Card } from '../../../game/store/card/card';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { CardList } from '../../../game/store/state/card-list';
import { StateUtils } from '../../../game/store/state-utils';
import { Player } from '../../../game';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: Adaman,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  const hasEnergyInHand =
    player.hand.cards.filter((c) => {
      return c.superType === SuperType.ENERGY && c.name === 'Metal Energy';
    }).length >= 2;

  if (!hasEnergyInHand) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  MOVE_CARDS(store, state, player.hand, player.supporter, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  // prepare card list without this supporter
  const handTemp = new CardList();
  handTemp.cards = player.hand.cards.filter((c) => c !== self);

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      handTemp,
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Metal Energy' },
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

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      {},
      { min: 1, max: 2, allowCancel: false },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  if (cards.length > 0) {
    MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: self });
    SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
  }

  return SHUFFLE_DECK(store, state, player);
}

export class Adaman extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '135';
  public name: string = 'Adaman';
  public fullName: string = 'Adaman ASR';
  public text: string = `You can use this card only if you discard 2 [M] Energy cards from your hand.

Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.`;

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    const hasEnergyInHand =
      player.hand.cards.filter((c) => {
        return c.superType === SuperType.ENERGY && c.name === 'Metal Energy';
      }).length >= 2;

    if (!hasEnergyInHand) {
      return false;
    }

    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }
}
