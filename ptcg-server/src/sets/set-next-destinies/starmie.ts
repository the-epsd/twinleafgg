import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';
import { ApplyWeaknessEffect, AfterDamageEffect } from '../../game/store/effects/attack-effects';

export class Starmie extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Staryu';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public retreat = [];

  public attacks = [
    {
      name: 'Confuse Ray',
      cost: [C],
      damage: 0,
      text: 'The Defending Pokémon is now Confused.'
    },
    {
      name: 'Swift',
      cost: [W],
      damage: 50,
      text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, or any other effects on the Defending Pokémon.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '24';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Starmie';
  public fullName: string = 'Starmie NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Confuse Ray
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
    }

    // Swift - damage isn't affected by Weakness, Resistance, or effects
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Apply 50 damage directly, bypassing weakness/resistance/effects
      const applyWeakness = new ApplyWeaknessEffect(effect, 50);
      store.reduceEffect(state, applyWeakness);

      // Set effect.damage to 0 so normal damage calculation is skipped
      effect.damage = 0;

      // Directly add damage
      opponent.active.damage += 50;
      const afterDamage = new AfterDamageEffect(effect, 50);
      state = store.reduceEffect(state, afterDamage);
    }

    return state;
  }
}
