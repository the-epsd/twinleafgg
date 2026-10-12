import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, SlotType } from '../../../game';
import { AddSpecialConditionsPowerEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import {
  WAS_ATTACK_USED,
  IS_ABILITY_BLOCKED,
  ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT,
} from '../../../game/store/prefabs/prefabs';
import { DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON } from '../../../game/store/prefabs/costs';

export class Magmortar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Magmar';
  public cardType: CardType[] = [R];
  public hp: number = 130;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Incandescent Body',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is your Active Pokémon and is damaged by an opponent\'s attack (even if this Pokémon is Knocked Out), the Attacking Pokémon is now Burned.'
  }];

  public attacks = [
    {
      name: 'Fire Blaster',
      cost: [R, R, C],
      damage: 80,
      damageCalculation: '+',
      text: 'You may discard 2 Energy from this Pokémon. If you do, this attack does 80 more damage.'
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Magmortar';
  public fullName: string = 'Magmortar UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Incandescent Body — Ref: set-ascended-heroes/numel.ts / set-twilight-masquerade/heatran.ts
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })) {
      const abilityOwner = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      if (!CAN_APPLY_ABILITY_TO_TARGET(
        store,
        state,
        abilityOwner,
        this.powers[0],
        this,
        effect.source,
      )) {
        return state;
      }

      store.reduceEffect(
        state,
        new AddSpecialConditionsPowerEffect(
          abilityOwner,
          this,
          effect.source,
          [SpecialCondition.BURNED],
        ),
      );
    }

    // Attack 1: Fire Blaster
    // Ref: set-temporal-forces/raging-bolt-ex.ts (Bellowing Thunder - DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON(
        store,
        state,
        effect,
        2,
        {},
        0,
        [SlotType.ACTIVE],
        transfers => {
          if (transfers.length >= 2) {
            effect.damage += 80;
          }
        }
      );
    }

    return state;
  }
}
