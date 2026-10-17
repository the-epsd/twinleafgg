import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, IS_POKEBODY_BLOCKED } from '../../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';

export class Magnezone extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Magneton';
  public hp: number = 120;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: 30 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Magnetize',
    powerType: PowerType.POKEBODY,
    text: 'If you have any Metal Energy attached to your Active Pokémon, the Retreat Cost for that Pokémon is 0.'
  }];

  public attacks = [{
    name: 'Metal Blast',
    cost: [M, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'Does 50 damage plus 10 more damage for each Metal Energy attached to Magnezone.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Magnezone';
  public fullName: string = 'Magnezone DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Magnetize
    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player || !StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const hasMetalEnergy = checkProvidedEnergy.energyMap.some(em =>
        em.provides.includes(CardType.METAL) || em.provides.includes(CardType.ANY)
      );

      if (hasMetalEnergy) {
        effect.cost = [];
      }
    }

    // Metal Blast
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergy);
      const metalCount = checkProvidedEnergy.energyMap.filter(em =>
        em.provides.includes(CardType.METAL) || em.provides.includes(CardType.ANY)
      ).length;
      effect.damage += metalCount * 10;
    }

    return state;
  }
}
