import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Vaporeon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.WATER;

  public hp: number = 80;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public evolvesFrom = 'Eevee';

  public attacks = [{
    name: 'Quick Attack',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 10,
    text: 'Flip a coin. If heads, this attack does 10 damage plus 20 more damage; if tails, this attack does 10 damage.'
  },
  {
    name: 'Water Gun',
    cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
    damage: 30,
    text: 'Does 30 damage plus 10 more damage for each {W} Energy attached to Vaporeon but not used to pay for this attack\'s Energy cost. Extra {W} Energy after the 2nd doesn\'t count.'
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '12';

  public name: string = 'Vaporeon';

  public fullName: string = 'Vaporeon JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result) {
          effect.damage += 20;
        } else {
          effect.damage += 10;
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      // Check attack cost
      const checkCost = new CheckAttackCostEffect(player, this.attacks[1]);
      state = store.reduceEffect(state, checkCost);

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      // Count total WATER energy provided
      const totalWaterEnergy = checkEnergy.energyMap.reduce((sum, energy) => {
        return sum + energy.provides.filter(type => type === CardType.WATER).length;
      }, 0);

      // Get number of extra WATER energy  
      const extraWaterEnergy = totalWaterEnergy - checkCost.cost.length;

      effect.damage += extraWaterEnergy * 10;
    }


    return state;
  }

}