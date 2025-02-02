import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {StoreLike,State, CoinFlipPrompt, GameMessage} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {AttackEffect} from '../../game/store/effects/game-effects';

export class Zweilous extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [ C, C ];

  public attacks = [
    { 
      name: 'Double Hit', 
      cost: [C], 
      damage: 20, 
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 20 damage times the number of heads.' 
    },
    { 
      name: 'Strength', 
      cost: [D, C, C], 
      damage: 50,
      text: '' 
    },
    
  ];

  public set: string = 'NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';
  public name: string = 'Zweilous';
  public fullName: string = 'Zweilous NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Double Hit
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 20 * heads;
      });
    }

    return state;
  }
  
}