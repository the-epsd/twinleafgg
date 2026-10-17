import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Mothim extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Burmy';
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Silver Wind',
    cost: [],
    damage: 0,
    text: 'During your next turn, if an attack does damage to the Defending Pokémon (after applying Weakness and Resistance), that attack does 40 more damage.'
  },
  {
    name: 'Raging Scales',
    cost: [G, C],
    damage: 30,
    damageCalculation: '+',
    text: 'If Mothim has any damage counters on it, this attack does 30 damage plus 40 more damage.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Mothim';
  public fullName: string = 'Mothim SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Silver Wind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN(store, state, effect, this, 40);
    }

    // Raging Scales
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.player.active.damage > 0) {
        effect.damage += 40;
      }
    }

    return state;
  }
}
