import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Seadra extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Horsea';
  public cardType: CardType[] = [W];
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Wave Splash',
    cost: [W],
    damage: 20,
    text: ''
  }, {
    name: 'Water Bullet',
    cost: [C, C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Flip a number of coins equal to the number of [W] Energy attached to Seadra. This attack does 30 damage plus 10 more damage for each heads.'
  }];

  public set: string = 'AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '58';
  public name: string = 'Seadra';
  public fullName: string = 'Seadra AQ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      // Count only energies that provide [W]
      let waterEnergyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        if (em.provides.includes(CardType.WATER) || em.provides.includes(CardType.ANY)) {
          waterEnergyCount++;
        }
      });

      if (waterEnergyCount > 0) {
        MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, waterEnergyCount, results => {
          effect.damage += results.filter(r => r).length * 10;
        });
      }
    }

    return state;
  }

}