import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StoreLike, State } from '../../game';
import { Stage, CardType } from '../../game/store/card/card-types';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Greedent extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Skwovet';
  public cardType: CardType = C;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Bite',
    cost: [C, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Enhanced Fang',
    cost: [C, C, C],
    damage: 80,
    damageCalculation: '+',
    text: 'If this Pokémon has a Pokémon Tool attached, this attack does 80 more damage.'
  }];

  public set: string = 'SVI';
  public name: string = 'Greedent';
  public fullName: string = 'Greedent SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '152';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.source.tools.length > 0) {
        effect.damage += 80;
      }
    }

    return state;
  }

}