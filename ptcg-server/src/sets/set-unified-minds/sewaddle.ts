import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { GamePhase, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { COIN_FLIP_PROMPT, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Sewaddle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType = G;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Swaddling Leaves',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon takes 10 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Surprise Attack',
    cost: [G],
    damage: 20,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Sewaddle';
  public fullName: string = 'Sewaddle UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Swaddling Leaves: reduce damage taken by 10 after Weakness/Resistance
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

      effect.damage = Math.max(0, effect.damage - 10);
    }


    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
} 