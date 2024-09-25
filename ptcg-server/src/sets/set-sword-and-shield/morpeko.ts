import { State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class Morpeko extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];
  
  public regulationMark: string = 'D';

  public attacks = [{
    name: 'Attack the Wound',
    cost: [ CardType.LIGHTNING ],
    damage: 10,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 50 more damage.'
  }];

  public set: string = 'SSH';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '78';

  public name: string = 'Morpeko';

  public fullName: string = 'Morpeko SSH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {      
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
            
      if (opponent.active.damage > 0) {
        effect.damage += 50;
      }
      
      return state;
    }
    
    return state;
  }

}
