import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Meloetta extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Melodius Echo',
      cost: [ CardType.COLORLESS ],
      damage: 70,
      text: 'This attack does 70 damage for each Fusion Strike Energy ' +
        'attached to all of your Pokémon.'
    }
  ];

  public set: string = 'FST';

  public name: string = 'Meloetta';

  public fullName: string = 'Meloetta FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
  
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);
  
      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return EnergyType.SPECIAL && this.name == 'Fusion Strike Energy';
        }).length;
      });
      effect.damage == energyCount * 70;
    }
    return state;
  }
  
}