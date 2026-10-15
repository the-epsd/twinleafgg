import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AddSpecialConditionsPowerEffect } from '../../../game/store/effects/check-effects';
import { PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { IS_POKEBODY_BLOCKED, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Venomoth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Venonat';
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Dangerous Scales',
    powerType: PowerType.POKEBODY,
    text: 'If Venomoth is your Active Pokémon and is damaged by an opponent\'s attack (even if Venomoth is Knocked Out), the Attacking Pokémon is now Asleep and Poisoned.'
  }];

  public attacks = [{
    name: 'Disturbance Dive',
    cost: [G, G],
    damage: 50,
    text: 'Prevent all effects of an attack, excluding damage, done to Venomoth during your opponent\'s next turn.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
  public name: string = 'Venomoth';
  public fullName: string = 'Venomoth SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dangerous Scales
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
          [SpecialCondition.ASLEEP, SpecialCondition.POISONED],
        ),
      );
    }

    // Disturbance Dive
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
    }

    return state;
  }
}
