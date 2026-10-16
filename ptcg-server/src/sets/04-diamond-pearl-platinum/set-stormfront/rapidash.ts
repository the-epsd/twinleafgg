import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AddSpecialConditionsPowerEffect } from '../../../game/store/effects/check-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';
import { IS_POKEBODY_BLOCKED, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Rapidash extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Ponyta';
  public hp: number = 80;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: +20 }];
  public retreat = [];

  public powers = [{
    name: 'Burning Mane',
    powerType: PowerType.POKEBODY,
    text: 'If Rapidash is your Active Pokémon and is damaged by an opponent\'s attack (even if Rapidash is Knocked Out), the Attacking Pokémon is now Burned.'
  }];

  public attacks = [{
    name: 'Rear Kick',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Shooting Fire',
    cost: [R, R],
    damage: 0,
    text: 'Discard 2 Fire Energy attached to Rapidash and choose 1 of your opponent\'s Pokémon. This attack does 60 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Rapidash';
  public fullName: string = 'Rapidash SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Burning Mane
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
          [SpecialCondition.BURNED],
        ),
      );
    }

    // Shooting Fire
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, CardType.FIRE);
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(60, effect, store, state);
    }

    return state;
  }
}
