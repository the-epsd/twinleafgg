import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Zekrom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Slash',
    cost: [L, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Nitro Thunder',
    cost: [L, C, C],
    damage: 80,
    damageCalculation: '+',
    text: 'If this Pokémon has any [R] Energy attached, this attack does 80 more damage.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Zekrom';
  public fullName: string = 'Zekrom 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Nitro Thunder
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkEnergy);

      const hasFire = checkEnergy.energyMap.some(em =>
        em.provides.some(t => t === CardType.FIRE || t === CardType.ANY)
      );

      if (hasFire) {
        effect.damage += 80;
      }
    }

    return state;
  }
}
