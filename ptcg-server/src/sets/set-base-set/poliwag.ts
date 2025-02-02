import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Poliwag extends PokemonCard {

  public name = 'Poliwag';
  
  public set = 'BS';
  
  public fullName = 'Poliwag BS';
  
  public cardType = CardType.WATER;

  public stage = Stage.BASIC;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '59';

  public hp = 40;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Water Gun',
      cost: [CardType.WATER],
      damage: 10,
      text: 'Does 10 damage plus 10 more damage for each {W} Energy attached to Poliwag but not used to pay for this attack’s Energy cost. Extra {W} Energy after the 2nd don’t count.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      
      const player = effect.player;

      // Check attack cost
      const checkCost = new CheckAttackCostEffect(player, this.attacks[0]);
      state = store.reduceEffect(state, checkCost);
      
      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      // Filter for Water energies
      const waterEnergies = checkEnergy.energyMap.filter(e => e.provides.includes(CardType.WATER));
      
      // Add damage for extra Water energies up to 2
      const extraEnergies = Math.min(waterEnergies.length - checkCost.cost.length, 2);
      effect.damage += extraEnergies * 10;
    }
    
    return state;
  }

}
