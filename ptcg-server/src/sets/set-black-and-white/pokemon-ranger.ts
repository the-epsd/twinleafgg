import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { PlayerType } from '../../game';

export class PokemonRanger extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW';

  public name: string = 'Pokemon Ranger';

  public fullName: string = 'Pokemon Ranger BW';

  public text: string =
    'Remove all effects of attacks on each player and his' +
    'or her Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const topPlayer = state.players[PlayerType.TOP_PLAYER];
      const bottomPlayer = state.players[PlayerType.BOTTOM_PLAYER];
    
      topPlayer.active.clearAttackEffects();
      topPlayer.bench.forEach(b => b.clearAttackEffects());
    
      bottomPlayer.active.clearAttackEffects(); 
      bottomPlayer.bench.forEach(b => b.clearAttackEffects());
    
    }
    
    return state;
    
  }
}