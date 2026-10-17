import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Grumpig extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Spoink';
  public hp: number = 90;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Magical Step',
    cost: [],
    damage: 0,
    text: 'The Defending Pokémon is now Confused. Put 6 damage counters instead of 3 on the Confused Pokémon.'
  },
  {
    name: 'Grind',
    cost: [P, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Does 20 damage times the amount of Energy attached to Grumpig.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Grumpig';
  public fullName: string = 'Grumpig LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Magical Step
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      specialConditionEffect.confusionDamage = 60;
      store.reduceEffect(state, specialConditionEffect);
    }

    // Grind
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const cardList = player.active;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkProvidedEnergy);
      const energyCount = checkProvidedEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
      effect.damage = 20 * energyCount;
    }

    return state;
  }
}
