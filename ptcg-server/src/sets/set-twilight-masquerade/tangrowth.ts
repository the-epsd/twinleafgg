import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { GamePhase, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Tangrowth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Tangela';
  public cardType = G;
  public hp: number = 150;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Thicket Body',
    powerType: PowerType.ABILITY,
    text: 'This Pokemon takes 30 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Loom Over',
    cost: [G, C, C],
    damage: 150,
    damageCalculation: '-',
    text: 'This attack does 10 less damage for each damage counter on this Pokémon.'
  }];

  public regulationMark: string = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Tangrowth';
  public fullName: string = 'Tangrowth TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bouffer: reduce damage taken by 30 after Weakness/Resistance
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      // It's not this pokemon card
      if (pokemonCard !== this) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 30);
    }


    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage -= effect.player.active.damage;
      return state;
    }

    return state;
  }
} 