import { State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Heatran extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.METAL;
  public hp: number = 140;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.GRASS, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [{
    name: 'Guard Claw',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance). '
  },
  {
    name: 'Iron Hammer',
    cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS],
    damage: 80,
    damageCalculation: '+',
    text: 'If this Pokémon has any [R] Energy attached, this attack does 80 more damage. '
  }];

  public set: string = 'BRS';
  public regulationMark: string = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Heatran';
  public fullName: string = 'Heatran BRS';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 30;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergy);

      const hasFireEnergy = checkProvidedEnergy.energyMap.some(e => e.provides.includes(CardType.ANY) || e.provides.includes(CardType.FIRE));

      if (hasFireEnergy) {
        effect.damage += 80;
      }
      return state;
    }

    return state;
  }
}
