import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PowerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Mightyena extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public evolvesFrom = 'Poochyena';

  public cardType: CardType = CardType.DARK;  

  public hp: number = 110;

  public weakness = [{ type: CardType.GRASS }];

  public resistance = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public abilities = [{
    name: 'Hustle Bark',
    powerType: PowerType.ABILITY, 
    text: 'If your opponent has any Pokémon VMAX in play, this Pokémon\'s attacks cost [C][C][C] less.'
  }];

  public attacks = [{
    name: 'Wild Tackle',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 160,
    text: 'This Pokémon also does 50 damage to itself.'
  }];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public set2: string = 'astralradiance';

  public setNumber: string = '96';

  public name: string = 'Mightyena';

  public fullName: string = 'Mightyena ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {

      const checkEnergy = new CheckProvidedEnergyEffect(effect.player);
      store.reduceEffect(state, checkEnergy);
  
      const opponent = StateUtils.getOpponent(state, effect.player);

      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && opponentActive.tags.includes(CardTag.POKEMON_VMAX)) {

        this.attacks[0].cost = [ ];
        
      }
    }
        
    return state;
  }
}
        