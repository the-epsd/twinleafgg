import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class HisuianArcanine extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public cardType = CardType.FIGHTING;

  public hp = 150;

  public evolvesFrom = 'Hisuian Growlithe';

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Boulder Crush',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: 50,
      text: ''
    },
    {
      name: 'Scorching Horn',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: 80,
      damageCalculation: '+',
      text: 'If this Pokémon has any [R] Energy attached, this attack does 80 more damage, and your opponent\'s Active Pokémon is now Burned.'
    }
  ];

  public set: string = 'ASR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '71';

  public name: string = 'Hisuian Arcanine';

  public fullName: string = 'Hisuian Arcanine ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const cardList = player.active;

      const checkEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
      state = store.reduceEffect(state, checkEnergyEffect);

      const hasAttachedEnergy = checkEnergyEffect.totalProvidedTypes.some(
        energy => energy.provides.includes(CardType.FIRE) || energy.provides.includes(CardType.ANY)
      );

      if (!hasAttachedEnergy) {
        return state;
      }

      effect.damage += 80;
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      store.reduceEffect(state, specialConditionEffect);
      return state;
    }

    return state;
  }
}