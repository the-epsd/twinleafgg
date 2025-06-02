import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
// Energy type constants (W, C, L) are assumed to be globally available as in other SV11B cards

export class Seismitoad extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Palpitoad';
  public cardType = W;
  public hp: number = 170;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Round',
      cost: [C, C, C],
      damage: 70,
      text: 'This attack does 70 damage for each of your Pokémon in play that has the Round attack.'
    },
    {
      name: 'Hyper Voice',
      cost: [W, C, C, C],
      damage: 160,
      text: ''
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV11B';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Seismitoad';
  public fullName: string = 'Seismitoad SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack effects would be implemented here if needed
    return state;
  }
} 