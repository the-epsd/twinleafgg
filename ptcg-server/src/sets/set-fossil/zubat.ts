import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { HealEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Zubat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 40;
  public weakness = [{ type: P }];
  public resistance = [{ type: F, value: -30 }];

  public attacks = [{
    name: 'Supersonic',
    cost: [C, C],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
  }, {
    name: 'Leech Life',
    cost: [G, C],
    damage: 10,
    text: 'Remove a number of damage counters from Zubat equal to the damage done to the Defending Pokémon (after applying Weakness and Resistance). If Zubat has fewer damage counters than that, remove all of them.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';
  public name: string = 'Zubat';
  public fullName: string = 'Zubat FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, flipResult => {
          if (flipResult) {
            const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialConditionEffect);
          }
        });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const target = player.active;

      const damageEffect = new DealDamageEffect(effect, 40);
      damageEffect.target = effect.target;

      state = store.reduceEffect(state, damageEffect);

      const damageToHeal = damageEffect.damage;

      // Heal damage
      const healEffect = new HealEffect(player, target, damageToHeal);
      state = store.reduceEffect(state, healEffect);
      return state;
    }

    return state;
  }
}