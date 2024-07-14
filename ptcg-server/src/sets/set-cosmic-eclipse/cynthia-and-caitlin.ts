import { ConfirmPrompt } from '../../game';
import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
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

  cards = player.hand.cards.filter(c => c !== self);

  if (!player.discard.cards.some(c => c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER) &&
      cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
  
  // Do not discard the card yet
  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  let recovered: Card[] = [];

  // first effect, recover supporter
  if (!player.discard.cards.some(c => c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER)) {
    // not recovering a supporter
  } else {
    yield store.prompt(state, new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.discard,
      { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
      { min: 1, max: 1, allowCancel: false }
    ), selected => {
      recovered = selected || [];

      recovered.forEach(c => {
        store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: c.name });
      });

      next();
    });
  }

  // only recovering supporter
  if (cards.length === 0) {
    player.discard.moveCardsTo(recovered, player.hand);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
  }

  state = store.prompt(state, new ConfirmPrompt(
    effect.player.id,
    GameMessage.WANT_TO_DRAW_CARDS,
  ), wantToUse => {
    if (wantToUse) {
      state = store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];

        player.hand.moveCardsTo(cards, player.discard);

        cards.forEach((card, index) => {
          store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
        });

        player.deck.moveTo(player.hand, 3);
      });
    }

    player.discard.moveCardsTo(recovered, player.hand);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
  });
    
  return state;
}

export class CynthiaAndCaitlin extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'CEC';
  
  public tags = [CardTag.TAG_TEAM];  

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '189';

  public name: string = 'Cynthia & Caitlin';

  public fullName: string = 'Cynthia & Caitlin CEC';

  public text: string =
    'Put a Supporter card from your discard pile into your hand. You can\'t choose Cynthia & Caitlin or a card you discarded with the effect of this card.'+
    ''+
    'When you play this card, you may discard another card from your hand. If you do, draw 3 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}
