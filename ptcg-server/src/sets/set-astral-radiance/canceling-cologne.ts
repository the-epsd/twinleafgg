import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../..';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class CancelingCologne extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'F';

  public set: string = 'ASR';

  public name: string = 'Canceling Cologne';

  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '136';

  public fullName: string = 'Canceling Cologne ASR';

  public text: string =
    'Until the end of your turn, your opponent\'s Active Pokémon has no Abilities. (This includes Pokémon that come into play during that turn.)';

  public CANCELING_COLOGNE_MARKER = 'CANCELING_COLOGNE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active) {
        opponent.active.getPokemons().forEach(pokemon => {
          pokemon.powers.forEach(power => {
            pokemon.powers.slice(pokemon.powers.indexOf(power), 1);
          });
        });
      }
      if (effect instanceof PowerEffect) {
        effect.preventDefault;
      }
      return state;
    }
    return state;
  }
        
}


//       const player = effect.player;
//       const opponent = StateUtils.getOpponent(state, player);

//       opponent.marker.addMarker(this.CANCELING_COLOGNE_MARKER, this);

//       if (opponent.marker.hasMarker(this.CANCELING_COLOGNE_MARKER, this)) {

//         opponent.active.getPokemons().forEach(pokemon => {
//         //   pokemon.powers.pop();
//           if (effect instanceof PowerEffect) {
//             throw new GameError(GameMessage.CANNOT_USE_POWER);
//           }
//         });

//         if (effect instanceof EndTurnEffect && opponent.marker.hasMarker(this.CANCELING_COLOGNE_MARKER, this)) {
//           opponent.marker.removeMarker(this.CANCELING_COLOGNE_MARKER, this);
//           console.log('marker cleared');
//         }

//         return state;
//       }
//       return state;
//     }
//     return state;
//   }
// }