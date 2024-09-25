import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Wailmer extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 100;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Hydro Pump',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 10,
    text: 'This attack does 20 more damage for each [W] Energy attached to this Pokémon.'
  }];

  public set: string = 'VIV';
  public regulationMark = 'D';
  public setNumber: string = '31';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wailmer';
  public fullName: string = 'Wailmer VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      const totalWaterEnergy = checkEnergy.energyMap.reduce((sum, energy) => {
        return sum + energy.provides.filter(type => type === CardType.WATER || type === CardType.ANY).length;
      }, 0);


      effect.damage += totalWaterEnergy * 20;
    }

    return state;
  }
}