import { ConfirmPrompt } from '../../game';
import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { DiscardToHandEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';


function* playCard(next: Function, store: StoreLike, state: State,
  self: CynthiaAndCaitlin, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  const blocked: number[] = [];
  player.discard.cards.forEach((card, index) => {
    if (card instanceof TrainerCard && card.name === 'Cynthia & Caitlin') {
      blocked.push(index);
    }
  });

  cards = player.hand.cards.filter(c => c !== self);

  if (!player.discard.cards.some(c => c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER) &&
    cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Do not discard the card yet
  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  let recovered: Card[] = [];

  // no supporter to recover, has to draw cards
  if (!player.discard.cards.some(c => c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER)) {
    state = store.prompt(state, new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      player.hand,
      {},
      { allowCancel: false, min: 1, max: 1, blocked }
    ), cards => {
      cards = cards || [];

      player.hand.moveCardsTo(cards, player.discard);

      cards.forEach((card, index) => {
        store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
      });

      player.deck.moveTo(player.hand, 3);
      player.supporter.moveCardTo(effect.trainerCard, player.discard);

      return state;
    });

  } else if (cards.length === 0) { // supporter available but can't discard
    state = store.prompt(state, new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.discard,
      { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
      { min: 1, max: 1, allowCancel: false, blocked }
    ), selected => {
      recovered = selected || [];

      recovered.forEach(c => {
        store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: c.name });
      });

      player.discard.moveCardsTo(recovered, player.hand);
      player.supporter.moveCardTo(effect.trainerCard, player.discard);

      return state;
    });
  } else { // supporter available, has to recover supporter, option to draw cards
    let discardedCards: Card[] = [];
    state = store.prompt(state, new ConfirmPrompt(
      effect.player.id,
      GameMessage.WANT_TO_DRAW_CARDS,
    ), wantToUse => {
      if (wantToUse) {
        state = store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          {},
          { allowCancel: false, min: 1, max: 1 }
        ), cards => {
          discardedCards = cards || [];

          discardedCards.forEach((card, index) => {
            store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
          });

          state = store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.discard,
            { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
            { min: 1, max: 1, allowCancel: false, blocked }
          ), selected => {
            recovered = selected || [];

            recovered.forEach(c => {
              store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: c.name });
            });

            player.discard.moveCardsTo(recovered, player.hand);
            player.hand.moveCardsTo(discardedCards, player.discard);
            player.deck.moveTo(player.hand, 3);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
          });
        });
      } else {
        state = store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
          { min: 1, max: 1, allowCancel: false, blocked }
        ), selected => {
          recovered = selected || [];

          recovered.forEach(c => {
            store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: c.name });
          });

          player.discard.moveCardsTo(recovered, player.hand);
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
        });
      }

      return state;
    });
  }

  return state;
}

export class CynthiaAndCaitlin extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'CEC';

  public tags = [CardTag.TAG_TEAM];

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '189';

  public name: string = 'Cynthia & Caitlin';

  public fullName: string = 'Cynthia & Caitlin CEC';

  public text: string =
    'Put a Supporter card from your discard pile into your hand. You can\'t choose Cynthia & Caitlin or a card you discarded with the effect of this card.' +
    '' +
    'When you play this card, you may discard another card from your hand. If you do, draw 3 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      // Check if DiscardToHandEffect is prevented
      const discardEffect = new DiscardToHandEffect(player, this);
      store.reduceEffect(state, discardEffect);

      // Creates array of all valid supporters aka supporters that are not Cynthia & Caitlin
      const validSupportersInDiscard = player.discard.cards.filter(c => c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER && c !== this);

      /* 
        Checks if array contains supporters that are not Cynthia & Caitlin. 
        If no supporters in discard pile that are not Cynthia & Caitlin exists, then the only
        supporters in discard are Cynthia & Caitlin, so you can't play this card.
      */
      if (validSupportersInDiscard.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (discardEffect.preventDefault) {
        // If prevented, just discard the card and return
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
      }

      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}
