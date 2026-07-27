import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Reshiram extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType = R;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Slash',
    cost: [R, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Laser Flame',
    cost: [R, C, C],
    damage: 80,
    damageCalculation: '+',
    text: 'If this Pokémon has any [L] Energy attached, this attack does 80 more damage.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Reshiram';
  public fullName: string = 'Reshiram 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Laser Flame
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkEnergy);

      const hasLightning = checkEnergy.energyMap.some(em =>
        em.provides.some(t => t === CardType.LIGHTNING || t === CardType.ANY)
      );

      if (hasLightning) {
        effect.damage += 80;
      }
    }

    return state;
  }
}
