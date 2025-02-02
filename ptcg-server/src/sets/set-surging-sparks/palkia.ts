import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Palkia extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 130;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Special Crash',
      cost: [CardType.GRASS, CardType.WATER],
      damage: 40,
      damageCalculation: 'x',
      text: 'This attack does 40 damage for each Basic Energy on this Pokémon.'
    }
  ];

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '136';

  public regulationMark = 'H';

  public name: string = 'Palkia';

  public fullName: string = 'Palkia SV7a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        if (em.card.energyType === EnergyType.BASIC) {
          energyCount += 1;
          console.log(energyCount);
        }
      });
      effect.damage = energyCount * 40;
    }
    return state;
  }
}