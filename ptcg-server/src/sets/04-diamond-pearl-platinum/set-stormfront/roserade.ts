import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AddSpecialConditionsPowerEffect } from '../../../game/store/effects/check-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { IS_POKEBODY_BLOCKED, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Roserade extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Roselia';
  public hp: number = 90;
  public cardType: CardType[] = [P];
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Hidden Poison',
    powerType: PowerType.POKEBODY,
    text: 'If Roserade is your Active Pokémon and is damaged by an opponent\'s attack (even if Roserade is Knocked Out), the Defending Pokémon is now Poisoned.'
  }];

  public attacks = [{
    name: 'Bowed Whip',
    cost: [C, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Flip a coin. If heads, discard an Energy card attached to that Pokémon.'
  },
  {
    name: 'Deep Poison',
    cost: [P, P, C],
    damage: 50,
    damageCalculation: '+',
    text: 'If the Defending Pokémon is Poisoned, this attack does 50 damage plus 30 more damage.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Roserade';
  public fullName: string = 'Roserade SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hidden Poison
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })) {
      const abilityOwner = StateUtils.findOwner(state, effect.target);
      if (IS_POKEBODY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }
      store.reduceEffect(
        state,
        new AddSpecialConditionsPowerEffect(
          abilityOwner,
          this,
          effect.source,
          [SpecialCondition.POISONED],
        ),
      );
    }

    // Bowed Whip
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(30, effect, store, state);
    }

    // Deep Poison
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      if (opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        effect.damage += 30;
      }
    }

    return state;
  }
}
