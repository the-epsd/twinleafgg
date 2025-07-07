import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PowerType } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Raikou extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Shining Body',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has any [L] Energy attached to it, any damage done to this Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Thunder Lance',
    cost: [C, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'This attack does 20 more damage for each [L] Energy attached to this Pokémon.'
  }];

  public set: string = 'BKT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Raikou';
  public fullName: string = 'Raikou BKT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      // Check if there is any Water energy attached
      const hasLightningEnergy = checkProvidedEnergy.energyMap.some(energy =>
        energy.provides.includes(CardType.LIGHTNING) || energy.provides.includes(CardType.ANY)
      );

      if (hasLightningEnergy) {
        effect.damage -= 20;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType =>
          cardType === CardType.LIGHTNING || cardType === CardType.ANY
        ).length;
      });
      effect.damage += energyCount * 20;
    }

    return state;
  }

}