import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, Card, ChooseCardsPrompt, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { CardList } from '../../../game/store/state/card-list';
import { COIN_FLIP_PROMPT, MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  // Flip a coin to determine how many bottom cards to look at
  let isHeads = false;
  yield COIN_FLIP_PROMPT(store, state, player, (result) => {
    isHeads = result;
    next();
  });

  // Heads: look at bottom 8; Tails: look at bottom 3
  const lookCount = isHeads ? 8 : 3;
  const deckLength = player.deck.cards.length;
  const start = Math.max(0, deckLength - lookCount);
  const end = deckLength;

  const deckBottom = new CardList();
  deckBottom.cards = player.deck.cards.slice(start, end);

  if (deckBottom.cards.length === 0) {
    return state;
  }

  // Choose 1 card from the bottom cards to put into hand
  let chosen: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      deckBottom,
      {},
      { min: 1, max: 1, allowCancel: false },
    ),
    (selected) => {
      chosen = selected || [];
      next();
    },
  );

  // Move chosen card to hand; the rest stay in deck
  chosen.forEach((card) => {
    MOVE_CARDS(store, state, player.deck, player.hand, {
      cards: [card],
      sourceCard: effect.trainerCard,
    });
  });

  // Shuffle the remaining deck cards
  return SHUFFLE_DECK(store, state, player);
}

export class DiggingDuo extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'F';
  public set: string = 'CRZ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '126';
  public name: string = 'Digging Duo';
  public fullName: string = 'Digging Duo CRZ 126';
  public text: string =
    'Flip a coin. If heads, look at the bottom 8 cards of your deck and put 1 of them into your hand. If tails, look at the bottom 3 cards of your deck and put 1 of them into your hand. Shuffle the other cards back into your deck. You may play only 1 Supporter card during your turn.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      effect.preventDefault = true;

      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
