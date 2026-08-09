import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Vibrava extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Trapinch';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Screech',
    cost: [C],
    damage: 0,
    text: 'During your next turn, the Defending Pokémon takes 50 more damage from this Pokémon\'s attacks'
  },
  {
    name: 'Cutter Wind',
    cost: [F, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';
  public name: string = 'Vibrava';
  public fullName: string = 'Vibrava SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN(store, state, effect, this, 50);
    }
    return state;
  }
}
