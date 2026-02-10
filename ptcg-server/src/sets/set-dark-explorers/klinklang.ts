import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DRAW_CARDS_UNTIL_CARDS_IN_HAND } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Klinklang extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Klang';
  public cardType: CardType = M;
  public hp: number = 140;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Metal Blast',
      cost: [C],
      damage: 20,
      damageCalculation: '+',
      text: 'Does 20 more damage for each Metal Energy attached to this Pokemon.'
    },
    {
      name: 'Lock Gear',
      cost: [M, M, C, C],
      damage: 60,
      text: 'Draw cards until you have 6 cards in your hand.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '77';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Klinklang';
  public fullName: string = 'Klinklang DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Metal Blast - 20 + 20 for each Metal energy
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      state = store.reduceEffect(state, checkProvidedEnergy);

      let metalEnergy = 0;
      for (const energyMap of checkProvidedEnergy.energyMap) {
        const metalCount = energyMap.provides.filter(t => t === CardType.METAL).length;
        metalEnergy += metalCount;
      }

      effect.damage += 20 * metalEnergy;
    }

    // Lock Gear - draw until 6 cards in hand
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 6);
    }

    return state;
  }
}
