import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { ApplyWeaknessEffect, AfterDamageEffect } from '../../game/store/effects/attack-effects';

import { CardType, Stage } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
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
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
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
