import { PowerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Golisopod extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.WATER;

  public hp: number = 140;

  public weakness = [{ type: CardType.GRASS }];
  
  public evolvesFrom: string = 'Wimpod';
  
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Emergency Exit',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has 2 or fewer Energy attached to it, it has no Retreat Cost.',
    useWhenInPlay: false
  }];
  
  public attacks = [{
    name: 'First Impression',
    cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 120,
    damageCalculation: '+',
    text: 'If this Pokémon was on the Bench and became your Active Pokémon this turn, this attack does 60 more damage.'
  }];

  public set: string = 'UNM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '50';

  public name: string = 'Golisopod';

  public fullName: string = 'Golisopod UNM';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof EndTurnEffect) {
      this.movedToActiveThisTurn = false; 
    }
    
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
      
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.length;
      });

      if (energyCount <= 2) {
        effect.cost = [];
      }
      
      return state;
    }
    
    if (effect instanceof RetreatEffect && effect.player.active.getPokemonCard() !== this) {
      this.movedToActiveThisTurn = true;
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (this.movedToActiveThisTurn) {
        effect.damage += 60;
      }
    }
    
    return state;
  }

}