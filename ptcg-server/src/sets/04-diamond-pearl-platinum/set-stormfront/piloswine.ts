import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Piloswine extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Swinub';
  public hp: number = 90;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G, value: +20 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rouse',
    cost: [F, C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Does 20 damage plus 10 more damage for each damage counter on Piloswine. Then, remove 4 damage counters from Piloswine.'
  },
  {
    name: 'Overrun',
    cost: [F, C, C, C],
    damage: 60,
    text: 'Does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';
  public name: string = 'Piloswine';
  public fullName: string = 'Piloswine SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rouse
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage = 20 + effect.player.active.damage;
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 40);
    }

    // Overrun
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
    }

    return state;
  }
}
