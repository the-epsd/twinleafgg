import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';


export class Luxray extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Luxio';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 160;

  public weakness = [ { type:CardType.FIGHTING } ];

  public retreat = [ ];

  public powers = [{
    name: 'Explosiveness',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in your hand when you are setting up to play, you may put it face down as your Active Pokémon.' 
  }];

  public attacks = [{

    name: 'Tail Snap',
    cost: [ CardType.COLORLESS ],
    damage: 20,
    text: ''
  }];

  public set: string = 'CRZ';

  public set2: string = 'crownzenith';

  public setNumber: string = '44';

  public name: string = 'Luxray';

  public fullName: string = 'Luxray CRZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (state.phase == GamePhase.SETUP) {
      this.stage = Stage.BASIC;
      return state;
    }
    return state;
  }
}
