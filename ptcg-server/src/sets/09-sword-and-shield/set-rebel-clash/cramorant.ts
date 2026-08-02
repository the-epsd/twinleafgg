import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  WAS_ATTACK_USED,
  COIN_FLIP_PROMPT,
  PREVENT_DAMAGE,
  PREVENT_EFFECTS_OF_ATTACKS,
} from '../../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';

export class Cramorant extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Dive',
    cost: [W],
    damage: 20,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all effects of attacks, including damage, done to this Pokémon.'
  }, {
    name: 'Hydro Pump',
    cost: [C, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'This attack does 20 more damage for each [W] Energy attached to this Pokémon.'
  }];

  public regulationMark: string = 'D';
  public set: string = 'RCL';
  public setNumber: string = '51';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cramorant';
  public fullName: string = 'Cramorant RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dive
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    // Hydro Pump
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkEnergy);

      let waterCount = 0;
      checkEnergy.energyMap.forEach(em => {
        waterCount += em.provides.filter(c => c === CardType.WATER || c === CardType.ANY).length;
      });

      effect.damage += 20 * waterCount;
    }

    return state;
  }
}
