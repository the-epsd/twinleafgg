import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Carbink extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [Y];
  public hp: number = 70;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Crystal Barrier',
    cost: [Y],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
  }, {
    name: 'Wonder Blast',
    cost: [C, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'This attack does 20 more damage for each [Y] Energy attached to this Pokémon.'
  }];

  public set: string = 'FLF';
  public setNumber: string = '68';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Carbink';
  public fullName: string = 'Carbink FLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Crystal Barrier
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    // Wonder Blast
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(effect.player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      let fairyCount = 0;
      for (const energyMap of checkProvidedEnergy.energyMap) {
        fairyCount += energyMap.provides.filter(t => t === CardType.FAIRY || t === CardType.ANY).length;
      }

      effect.damage += 20 * fairyCount;
    }

    return state;
  }
}
