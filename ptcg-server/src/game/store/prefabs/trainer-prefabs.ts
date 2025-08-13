import { GameError } from '../../game-error';
import { GameLog, GameMessage } from '../../game-message';
import { Card } from '../card/card';
import { TrainerCard } from '../card/trainer-card';
import { Effect } from '../effects/effect';
import { TrainerEffect } from '../effects/play-card-effects';
import { ChooseCardsPrompt } from '../prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../prompts/shuffle-prompt';
import { StateUtils } from '../state-utils';
import { State } from '../state/state';
import { Store } from '../store';
import { StoreLike } from '../store-like';
import { MOVE_CARDS } from './prefabs';

export function WAS_TRAINER_USED(effect: Effect, card: TrainerCard): effect is TrainerEffect {
  return effect instanceof TrainerEffect && effect.trainerCard === card;
}

export function DISCARD_X_CARDS_FROM_YOUR_HAND(effect: TrainerEffect, store: StoreLike, state: State, minAmount: number, maxAmount: number) {

  const player = effect.player;

  let cards: Card[] = [];
  cards = player.hand.cards.filter(c => c !== effect.trainerCard);

  const hasCardInHand = player.hand.cards.some(c => {
    return c instanceof Card;
  });
  if (!hasCardInHand) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (cards.length == maxAmount) {
    MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: effect.trainerCard });
  }

  if (cards.length > maxAmount) {
    state = store.prompt(state, new ChooseCardsPrompt(
      effect.player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      player.hand,
      {},
      { allowCancel: false, min: minAmount, max: maxAmount }
    ), cards => {
      cards = cards || [];
      if (cards.length === 0) {
        return;
      }
      MOVE_CARDS(store, state, player.hand, player.discard, { cards: cards, sourceCard: effect.trainerCard });
      cards.forEach((card, index) => {
        store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
      });
    });
  }
}

export function TRAINER_SHOW_OPPONENT_CARDS(effect: TrainerEffect, store: Store, state: State) {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const cards: Card[] = [];
  if (cards.length > 0) {
    store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => { });
  }
}

export function SHUFFLE_DECK(effect: TrainerEffect, store: Store, state: State) {
  const player = effect.player;
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}