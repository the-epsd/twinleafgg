import { GameError, GameMessage, StateUtils } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class LtSurgesStrategy extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'UNB';

  public name: string = 'Lt. Surge\'s Strategy';

  public fullName: string = 'Lt. Surge\'s Strategy UNB';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '178';

  public text: string =
    'You can play this card only if you have more Prize cards remaining than your opponent. During this turn, you can play 3 Supporter cards (including this card).';
  
  public playedSurgeThisTurn = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      
      if (this.playedSurgeThisTurn) {
        
      } else {
        // going to be increased by one in the play-trainer file
        player.supporterTurn = -2;
        player.hand.moveCardTo(this, player.discard);
        
        this.playedSurgeThisTurn = true;        
      }     
      
      return state;
    }
    
    if (effect instanceof EndTurnEffect) {
      this.playedSurgeThisTurn = false;
    }
    
    return state;
  }

}
