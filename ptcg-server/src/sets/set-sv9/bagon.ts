import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Bagon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DRAGON;
  public hp: number = 70;
  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    { 
      name: 'Bite', 
      cost: [ CardType.COLORLESS ], 
      damage: 10, 
      text: '' 
    },
    { 
      name: 'Reckless Charge', 
      cost: [ CardType.FIRE, CardType.WATER ], 
      damage: 50, 
      text: 'This Pokémon also does 10 damage to itself.' 
    },
              
  ];

  public set: string = 'SV9';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';

  public name: string = 'Bagon';
  public fullName: string = 'Bagon SV9';

  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]){
      const player = effect.player;
      
      const damageEffect = new PutDamageEffect(effect, 10);
      damageEffect.target = player.active;
      store.reduceEffect(state, damageEffect);
    }

    return state;
  }
  
}