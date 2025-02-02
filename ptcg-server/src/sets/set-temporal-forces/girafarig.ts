import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class Girafarig extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 90;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    { name: 'Psychic Assault', 
      cost: [ CardType.PSYCHIC, CardType.COLORLESS ], 
      damage: 20,
      damageCalculation: '+',
      text: 'This attack does 10 more damage for each damage counter on your opponent\'s Active Pokémon.' }
  ];

  public set: string = 'TEF';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';

  public name: string = 'Girafarig';
  public fullName: string = 'Girafarig TEF';

  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      effect.damage += opponent.active.damage;
    }

    return state;
  }
  
}