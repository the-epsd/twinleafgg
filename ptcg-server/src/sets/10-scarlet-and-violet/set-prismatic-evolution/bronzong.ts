import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GamePhase } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Bronzong extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Bronzor';
  public hp: number = 130;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Protective Bell',
    powerType: PowerType.ABILITY,
    text: 'All of your Pokémon take 10 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Heavy Impact',
    cost: [M, C],
    damage: 50,
    text: ''
  }];

  public regulationMark: string = 'H';
  public set: string = 'PRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Bronzong';
  public fullName: string = 'Bronzong PRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Protective Bell
    if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect)
      && state.phase === GamePhase.ATTACK) {
      const defender = StateUtils.findOwner(state, effect.target);
      const attacker = StateUtils.findOwner(state, effect.source);

      if (attacker === defender) {
        return state;
      }

      if (!StateUtils.isPokemonInPlay(defender, this)) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, defender, this)) {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 10);
    }

    return state;
  }
}
