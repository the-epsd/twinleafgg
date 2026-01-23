import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GamePhase } from '../../game';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Samurott2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Dewott';
  public cardType: CardType = W;
  public hp: number = 140;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public powers = [{
    name: 'Shell Armor',
    powerType: PowerType.ABILITY,
    text: 'Any damage done to this Pokemon by attacks is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Hydro Pump',
    cost: [C, C, C],
    damage: 70,
    damageCalculation: '+',
    text: 'Does 10 more damage for each [W] Energy attached to this Pokemon.'
  }];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Samurott';
  public fullName: string = 'Samurott BLW 32';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hydro Pump - Extra damage for Water Energy
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.WATER || cardType === CardType.ANY;
        }).length;
      });
      effect.damage += energyCount * 10;
    }

    // Shell Armor - Reduce damage from attacks
    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
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

      // Check if ability is blocked
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 20);
    }

    return state;
  }
}
