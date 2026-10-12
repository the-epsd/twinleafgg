import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { AddSpecialConditionsPowerEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import {
  IS_ABILITY_BLOCKED,
  ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT,
} from '../../../game/store/prefabs/prefabs';

export class Numel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [R];
  public hp: number = 80;
  public weakness = [{ type: W }];
  public resistance = [];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Incandescent Body',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), the Attacking Pokémon is now Burned.',
  }];

  public attacks = [{
    name: 'Combustion',
    cost: [R, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Numel';
  public fullName: string = 'Numel M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Incandescent Body — Ref: set-twilight-masquerade/heatran.ts
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

    return state;
  }
}
