import { PokemonCard, State, StoreLike } from '../..';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';

export class MysteriousFossil extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  
  public cardType: CardType = CardType.NONE;
  
  public hp: number = 10;
  
  public weakness = [ ];
  
  public retreat = [ ];
  
  public text = 'Play this card as if it were a 10HP Basic Pokemon.';

  public attacks = [];
  
  public set: string = 'FO';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '10';
  
  public name: string = 'Mysterious Fossil';
  
  public fullName: string = 'Mysterious Fossil FO';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
  
    this.superType = SuperType.TRAINER;

    return state;
  }

}
