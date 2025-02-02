import { CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class AlolanGrimer extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  
  public cardType: CardType = CardType.DARK;
  
  public hp: number = 80;
  
  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  
  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];
  
  public attacks = [{
    name: 'Collect',
    cost: [ ],
    damage: 0,
    text: 'Draw 2 cards.'
  }, {
    name: 'Sludge Bomb',
    cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 30,
    text: ''
  }];
  
  public set: string = 'UNM';
  
  public name: string = 'Alolan Grimer';
  
  public fullName: string = 'Alolan Grimer UNM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '127';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.deck.moveTo(player.hand, 2);
      return state;
    }
    
    return state;
  }
}