import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import {
  State,
  StoreLike,
  TrainerCard,
  GameMessage,
  Player,
  StateUtils,
  CardList,
  SelectPrompt,
  ChooseCardsPrompt,
} from '../../../game';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: Hiker,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Move to supporter zone, prevent default discard
  effect.preventDefault = true;
  MOVE_CARDS(store, state, player.hand, player.supporter, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });

  // Choose which player's deck to look at
  const options: GameMessage[] = [GameMessage.ORDER_YOUR_DECK, GameMessage.ORDER_OPPONENT_DECK];

  let chosenPlayerIndex: number = 0;
  yield store.prompt(
    state,
    new SelectPrompt(player.id, GameMessage.CHOOSE_OPTION, options, { allowCancel: false }),
    (choice) => {
      chosenPlayerIndex = choice;
      next();
    },
  );

  const targetPlayer = chosenPlayerIndex === 0 ? player : opponent;

  if (targetPlayer.deck.cards.length === 0) {
    return state;
  }

  // Look at top 5 cards
  const topCards = new CardList();
  MOVE_CARDS(store, state, targetPlayer.deck, topCards, {
    count: Math.min(5, targetPlayer.deck.cards.length),
    sourceCard: self,
  });

  // Choose 1 card
  let chosenCards: any[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      topCards,
      {},
      { min: 1, max: 1, allowCancel: false },
    ),
    (selected) => {
      chosenCards = selected || [];
      next();
    },
  );

  // Put chosen card aside, shuffle rest back into deck
  const chosenCard = chosenCards[0];

  // Move unchosen cards back to deck
  const remainingCards = topCards.cards.filter((c) => c !== chosenCard);
  remainingCards.forEach((card) => {
    MOVE_CARDS(store, state, topCards, targetPlayer.deck, { cards: [card], sourceCard: self });
  });

  // Shuffle the deck, then put the chosen card on top once the shuffle has resolved
  SHUFFLE_DECK(store, state, targetPlayer);
  store.waitPrompt(state, () => {
    MOVE_CARDS(store, state, topCards, targetPlayer.deck, { cards: [chosenCard], sourceCard: self });
    // unshift to put on top (cards[0] = top)
    const idx = targetPlayer.deck.cards.indexOf(chosenCard);
    if (idx > 0) {
      targetPlayer.deck.cards.splice(idx, 1);
      targetPlayer.deck.cards.unshift(chosenCard);
    }
  });

  return state;
}

export class Hiker extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '133';
  public name: string = 'Hiker';
  public fullName: string = 'Hiker CES';
  public text: string =
    "Look at the top 5 cards of either player's deck and choose 1 of them. That player shuffles the other cards back into their deck. Then, put the card you chose on top of that deck. You may play only 1 Supporter card during your turn (before your attack).";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
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
