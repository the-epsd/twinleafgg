import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Horsea extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 50;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Hydro Pump',
      cost: [CardType.WATER],
      damage: 10,
      damageCalculation: '+',
      text: 'This attack does 10 more damage times the amount of [W] Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'DRM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '16';

  public name: string = 'Horsea';

  public fullName: string = 'Horsea DRM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType =>
          cardType === CardType.WATER || cardType === CardType.ANY
        ).length;
      });
      effect.damage += energyCount * 10;
    }
    
    return state;
  }

}