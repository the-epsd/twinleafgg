import { TrainerType, SuperType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import {
  TrainerCard,
  StoreLike,
  State,
  StateUtils,
  GameMessage,
  ChooseCardsPrompt,
  Card,
  Player,
} from '../../../game';
import { SHOW_CARDS_TO_PLAYER, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: Oleana,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Move to supporter zone first (manual because we use generator)
  MOVE_CARDS(store, state, player.hand, player.supporter, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });
  effect.preventDefault = true;

  // Discard 2 other cards from hand
  const nonSelfCards = player.hand.cards.filter((c) => c !== effect.trainerCard);
  if (nonSelfCards.length >= 2) {
    yield store.prompt(
      state,
      new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { min: 2, max: 2, allowCancel: false },
      ),
      (selected: Card[] | null) => {
        const cards = selected || [];
        MOVE_CARDS(store, state, player.hand, player.discard, { cards: cards, sourceCard: self });
        next();
      },
    );
  }

  // Show opponent's hand to us
  if (opponent.hand.cards.length > 0) {
    SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);
  }

  // Let player choose a Trainer card from opponent's hand to put on bottom of deck
  const trainerCards = opponent.hand.cards.filter((c) => c.superType === SuperType.TRAINER);
  if (trainerCards.length > 0) {
    yield store.prompt(
      state,
      new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        opponent.hand,
        { superType: SuperType.TRAINER },
        { min: 0, max: 1, allowCancel: false },
      ),
      (selected: Card[] | null) => {
        const cards = selected || [];
        cards.forEach((card) => {
          // Put on bottom of deck
          MOVE_CARDS(store, state, opponent.hand, opponent.deck, {
            cards: [card],
            sourceCard: self,
          });
        });
        next();
      },
    );
  }

  return state;
}

export class Oleana extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'D';
  public set: string = 'RCL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '163';
  public name: string = 'Oleana';
  public fullName: string = 'Oleana RCL';
  public text: string =
    'You can play this card only if you discard 2 other cards from your hand. Your opponent reveals their hand. Put a Trainer card you find there on the bottom of their deck. You may play only 1 Supporter card during your turn.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    const nonSelfCards = player.hand.cards.filter((c) => c !== this);
    if (nonSelfCards.length < 2) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const nonSelfCards = player.hand.cards.filter((c) => c !== effect.trainerCard);

      if (nonSelfCards.length < 2) {
        return state;
      }

      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
