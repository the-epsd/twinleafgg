import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';


export class Espathraex extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Flittle';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 260;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS ];

  public powers = 
    [{
      name: 'Dazzling Gaze',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'As long as this Pokémon is in the Active Spot, attacks used by your opponent\'s Active Pokémon cost C more.'
    }];

  public attacks = [
    {
      name: 'Psy Ball',
      cost: [ CardType.PSYCHIC ],
      damage: 30,
      text: 'This attack does 30 more damage for each Energy attached to both Active Pokémon.'
    }
  ];

  public regulationMark = 'G';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '23';
  
  public set = 'SV4';

  public name: string = 'Espathra ex';

  public fullName: string = 'Espathra ex SV4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;

      if (player.active.cards[0] !== this) {
        return state; // Not active
      }

      if (effect instanceof CheckAttackCostEffect) {
        effect.cost.push(CardType.COLORLESS); 
      }  

      if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);
      
        const playerProvidedEnergy = new CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, playerProvidedEnergy);
        const playerEnergyCount = playerProvidedEnergy.energyMap
          .reduce((left, p) => left + p.provides.length, 0);
      
        const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
        store.reduceEffect(state, opponentProvidedEnergy);
        const opponentEnergyCount = opponentProvidedEnergy.energyMap
          .reduce((left, p) => left + p.provides.length, 0);
      
        effect.damage += (playerEnergyCount + opponentEnergyCount) * 30;
      }

      if (effect instanceof PutDamageEffect) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);
  
        // Target is not Active
        if (effect.target === player.active || effect.target === opponent.active) {
          return state;
        }
  
        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, this.powers[1], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }
  
        // Target is this Espathra
        if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
          // Try to reduce PowerEffect, to check if something is blocking our ability
          try {
            const powerEffect = new PowerEffect(player, this.powers[1], this);
            store.reduceEffect(state, powerEffect);
          } catch {
            return state;
          }
  
          effect.preventDefault = true;
        }
        return state;
      }
      return state;
    }
    return state;
  }

}
