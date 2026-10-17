import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Lucario extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Riolu';
  public hp: number = 90;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Focus Blast',
    cost: [F],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Spike Lariat',
    cost: [F, F, C],
    damage: 60,
    damageCalculation: '+',
    text: 'If the Defending Pokémon already has any damage counters on it, this attack does 60 damage plus 20 more damage.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Lucario';
  public fullName: string = 'Lucario LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Focus Blast
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(30, effect, store, state);
    }

    // Spike Lariat
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.damage > 0) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
