import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { CardList, GameError, GameMessage } from '../../game';




export class Iono extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'PAL';

  public name: string = 'Iono';

  public fullName: string = 'Iono';

  public text: string =
    'Each player shuffles his or her hand into his or her deck. ' +
    'Then, each player draws a card for each of his or her remaining Prize cards.';
    
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
  
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const cards = player.hand.cards.filter(c => c !== this);
    
      if (cards.length === 0 && player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      
      // Create deckBottom and move hand into it
      const deckBottom = new CardList();
      player.hand.moveTo(deckBottom, cards.length);
    
      // Create deckBottom for opponent and move hand
      const opponentdeckBottom = new CardList();
      opponent.hand.moveTo(opponentdeckBottom, cards.length);
    
    
      // Later, move deckBottom to player's deck
    
      deckBottom.moveTo(player.deck, cards.length);
      opponentdeckBottom.moveTo(opponent.deck, cards.length);
    
      player.deck.moveTo(player.hand, player.getPrizeLeft());
      opponent.deck.moveTo(opponent.hand, opponent.getPrizeLeft());
    
      return state;
    }

    return state;

  }
}