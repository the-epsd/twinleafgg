import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { Card, Player } from '../../../game';
import { State } from '../../../game/store/state/state';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { DRAW_CARDS, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  effect: TrainerEffect,
  self: Card,
): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];

  // This card is still in hand while resolving, so it can't be one of the discarded cards
  const blocked: number[] = [];
  player.hand.cards.forEach((c, index) => {
    if (c === self) {
      blocked.push(index);
    }
  });

  if (player.hand.cards.length - blocked.length < 2) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      player.hand,
      {},
      { allowCancel: false, min: 2, max: 2, blocked },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: self });
  DRAW_CARDS(store, state, player, 4);
}

export class Sophocles extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'BUS';
  public cardImage = 'assets/cardback.png';
  public setNumber = '123';
  public name: string = 'Sophocles';
  public fullName: string = 'Sophocles BUS';
  public text: string = 'Discard 2 cards from your hand. If you do, draw 4 cards.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    // Need 2 other cards in hand to discard
    if (player.hand.cards.filter((c) => c !== this).length < 2) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, effect, this);
      return generator.next().value;
    }

    return state;
  }
}
