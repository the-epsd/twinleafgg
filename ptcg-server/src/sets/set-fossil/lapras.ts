import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Lapras extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 80;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Water Gun',
      cost: [ CardType.WATER ],
      damage: 10,
      text: 'Does 10 damage plus 10 more damage for each {W} Energy attached to Lapras but not used to pay for this attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
    },
    {
      name: 'Confuse Ray',
      cost: [ CardType.WATER, CardType.WATER ],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    },
  ];

  public set: string = 'FO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '10';

  public name: string = 'Lapras';

  public fullName: string = 'Lapras FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
    
      // Check attack cost
      const checkCost = new CheckAttackCostEffect(player, this.attacks[0]);
      state = store.reduceEffect(state, checkCost);
      
      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      // Filter for only Water Energy
      const waterEnergy = checkEnergy.energyMap.filter(e => 
        e.provides.includes(CardType.WATER));

      // Get number of extra Water energy  
      const extraWaterEnergy = waterEnergy.length - checkCost.cost.length;

      // Apply damage boost based on extra Water energy
      if (extraWaterEnergy == 1) effect.damage += 10; 
      if (extraWaterEnergy == 2) effect.damage += 20;
    
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
  
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const addSpecialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
          store.reduceEffect(state, addSpecialCondition);
        }
      });
      return state;
    }
    return state;
  }
}