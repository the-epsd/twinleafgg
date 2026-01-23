import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Dewott2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Oshawott';
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Aqua Tail',
      cost: [C, C],
      damage: 30,
      damageCalculation: '+',
      text: 'Flip a coin for each Water Energy attached to this Pokemon. This attack does 10 more damage for each heads.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';
  public name: string = 'Dewott';
  public fullName: string = 'Dewott BLW 30';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkEnergy);

      let waterEnergyCount = 0;
      checkEnergy.energyMap.forEach(em => {
        waterEnergyCount += em.provides.filter(p => p === CardType.WATER).length;
      });

      if (waterEnergyCount > 0) {
        MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, waterEnergyCount, results => {
          const heads = results.filter(r => r).length;
          (effect as AttackEffect).damage += 10 * heads;
        });
      }
    }
    return state;
  }
}
