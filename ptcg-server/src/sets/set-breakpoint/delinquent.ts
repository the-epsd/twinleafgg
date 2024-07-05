import { ChooseCardsPrompt, GameError, GameMessage } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* playCard(next: Function, store: StoreLike, state: State,
  self: Delinquent, effect: TrainerEffect): IterableIterator<State> {

  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const opponentCards = opponent.hand.cards;

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  const stadiumCard = StateUtils.getStadiumCard(state);

  if (stadiumCard == undefined) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (stadiumCard !== undefined) {
    // Discard Stadium
    const cardList = StateUtils.findCardList(state, stadiumCard);
    const player = StateUtils.findOwner(state, cardList);
    cardList.moveTo(player.discard);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  if (opponentCards.length <= 3) {
    opponentCards.forEach(c => {
      opponent.hand.moveCardTo(c, opponent.discard);  
    });    
    
    player.supporter.moveCardTo(effect.trainerCard, player.discard);        
    return state;
  }

  if (opponentCards.length > 3) {
    store.prompt(state, new ChooseCardsPrompt(
      opponent.id,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      opponent.hand,
      {},
      { min: 3, max: 3, allowCancel: false }
    ), selected => {
      const cards = selected || [];
      opponent.hand.moveCardsTo(cards, opponent.discard);
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
      return state;
    });
  } 
}

export class Delinquent extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BKT';

  public name: string = 'Delinquent';

  public fullName: string = 'Delinquent BKT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '98';

  public text: string =
    'Discard any Stadium card in play. If you do, your opponent discards 3 cards from his or her hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
