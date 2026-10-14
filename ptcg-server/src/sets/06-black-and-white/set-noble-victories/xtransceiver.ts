import { GameError, GameMessage, Player, State, StateUtils, StoreLike } from '../../../game';
import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { Card } from '../../../game/store/card/card';
import {
  COIN_FLIP_PROMPT,
  MOVE_CARDS,
  SHOW_CARDS_TO_PLAYER,
  SHUFFLE_DECK,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: Xtransceiver,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;
  MOVE_CARDS(store, state, player.hand, player.supporter, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });

  let coinResult = false;
  yield COIN_FLIP_PROMPT(store, state, player, (result) => {
    coinResult = result;
    next();
  });

  if (!coinResult) {
    MOVE_CARDS(store, state, player.supporter, player.discard, {
      cards: [effect.trainerCard],
      sourceCard: self,
    });
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
      { min: 0, max: 1, allowCancel: false },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  if (cards.length > 0) {
    SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
    MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: self });
  }

  SHUFFLE_DECK(store, state, player);
  MOVE_CARDS(store, state, player.supporter, player.discard, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });

  return state;
}

export class Xtransceiver extends TrainerCard {
  protected _trainerType = TrainerType.ITEM;
  public set: string = 'NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public regulationMark = 'E';
  public name: string = 'Xtransceiver';
  public fullName: string = 'Xtransceiver NVI';
  public text: string =
    'Flip a coin. If heads, search your deck for a Supporter card, reveal it, and put it into your hand. Shuffle your deck afterward.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
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
