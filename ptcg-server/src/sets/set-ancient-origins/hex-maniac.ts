import { GameError, GameMessage, StateUtils } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class HexManiac extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'AOR';

  public setNumber = '75';
  
  public name: string = 'Hex Maniac';

  public fullName: string = 'Hex Maniac AOR';

  public text: string =
    'Until the end of your opponent\'s next turn, each Pokémon in play, in each player\'s hand, and in each player\'s discard pile has no Abilities. (This includes cards that come into play on that turn.)';
    
  public HEX_MANIAC_MARKER = 'HEX_MANIAC_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }
      
      player.marker.addMarker(this.HEX_MANIAC_MARKER, this);
      opponent.marker.addMarker(this.HEX_MANIAC_MARKER, this);
      
      player.supporterTurn = 1;
    }
    
    if (effect instanceof PowerEffect && effect.player.marker.hasMarker(this.HEX_MANIAC_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }
    
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.HEX_MANIAC_MARKER)) {
      effect.player.marker.removeMarker(this.HEX_MANIAC_MARKER, this);
    }
    
    return state;
    
  }
}