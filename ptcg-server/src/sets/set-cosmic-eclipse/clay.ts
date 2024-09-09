import { GameError, GameLog, GameMessage } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CardList } from '../../game/store/state/card-list';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class CLAY extends TrainerCard {

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '188';
  
  public trainerType = TrainerType.SUPPORTER;
  
  public set = 'CEC';

  public name = 'CLAY';

  public fullName = 'CLAY CEC';

  public text = 'Discard the top 7 cards of your deck. If any of those cards are Item cards, put them into your hand.';
    
  reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      player.hand.moveCardTo(this, player.supporter);
      
      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }
      
      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 7);

      // Filter for item cards
      const itemCards = deckTop.cards.filter(c => c instanceof TrainerCard && c.trainerType === TrainerType.ITEM);
    
      // Move all cards to discard
      deckTop.moveTo(player.discard, deckTop.cards.length);
    
      itemCards.forEach((card, index) => {
        store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
      });
      
      // Move item cards to hand
      player.discard.moveCardsTo(itemCards, player.hand);
      player.supporter.moveCardTo(this, player.discard);      
    
      return state;
    }
    return state;
  }
}