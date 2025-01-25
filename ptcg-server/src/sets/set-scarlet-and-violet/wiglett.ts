import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, CoinFlipPrompt, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class Wiglett extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 60;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [ CardType.COLORLESS ];
  public attacks = [
    { 
      name: 'Dig a Little', 
      cost: [ CardType.COLORLESS ], 
      damage: 0, 
      text: 'Flip a coin. If heads, discard the top card of your opponent\'s deck.' 
    },
    { 
      name: 'Ram', 
      cost: [ CardType.COLORLESS, CardType.COLORLESS ], 
      damage: 20, 
      text: '' 
    }
              
  ];

  public set: string = 'SVI';
  public name: string = 'Wiglett';
  public fullName: string = 'Wiglett SVI';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          opponent.deck.moveTo(opponent.discard, 1);
        }
      });
    }

    return state;
  }
  
}