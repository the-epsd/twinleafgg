import { CardType, Format, SuperType } from './card-types';
import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { CardList } from '../state/card-list';

export abstract class Card {

  public abstract set: string;

  public abstract superType: SuperType;

  public abstract format: Format;

  public abstract fullName: string;

  public abstract name: string;

  public id: number = -1;

  public regulationMark: string = '';

  public tags: string[] = [];
  
  public setNumber: string = '';

  public set2: string = '';

  public retreat: CardType[] = [];
  
  static tags: any;
  
  public cards: CardList = new CardList;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
