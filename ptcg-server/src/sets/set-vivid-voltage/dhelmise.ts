import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Dhelmise extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 130;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Hook',
    cost: [CardType.COLORLESS],
    damage: 20,
    text: ''
  },
  {
    name: 'Special Anchor',
    cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 60,
    text: 'If this Pokemon has any Special Energy attached, this attack does 60 more damage.'
  }];

  public set: string = 'VIV';
  public regulationMark = 'D';
  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Dhelmise VIV';
  public name: string = 'Dhelmise';
  public setNumber: string = '19';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      state = store.reduceEffect(state, checkProvidedEnergy);

      let hasSpecialEnergy = false;
      checkProvidedEnergy.energyMap.forEach(energy => {
        if (energy.card.energyType === EnergyType.SPECIAL) {
          hasSpecialEnergy = true;
        }
      });

      if (hasSpecialEnergy) {
        effect.damage += 60;
      }
    }

    return state;
  }
}