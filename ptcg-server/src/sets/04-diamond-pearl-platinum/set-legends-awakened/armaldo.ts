import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Armaldo extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Anorith';
  public hp: number = 140;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G, value: +30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Fossil Armor',
    powerType: PowerType.POKEBODY,
    text: 'If Armaldo would be damaged by an attack, prevent that attack\'s damage done to Armaldo if that damage is 60 or less.'
  }];

  public attacks = [{
    name: 'Crush Claw',
    cost: [F, F, C],
    damage: 60,
    text: 'During your next turn, if an attack does damage to the Defending Pokémon (after applying Weakness and Resistance), that attack does 40 more damage.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Armaldo';
  public fullName: string = 'Armaldo LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fossil Armor
    if ((effect instanceof PutDamageEffect || effect instanceof DealDamageEffect) &&
      effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      if (effect.damage > 0 && effect.damage <= 60) {
        effect.preventDefault = true;
      }
    }

    // Crush Claw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN(store, state, effect, this, 40);
    }

    return state;
  }
}
