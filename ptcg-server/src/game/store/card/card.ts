import { CardType, EnergyType, Format, SuperType } from './card-types';
import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { CardList } from '../state/card-list';
import { Marker } from '../state/card-marker';
import { Attack, Power } from './pokemon-types';

export abstract class Card {

  public abstract set: string;

  public abstract superType: SuperType;

  public abstract format: Format;

  public abstract fullName: string;

  public abstract name: string;

  public energyType: EnergyType | undefined;

  public id: number = -1;

  public regulationMark: string = '';

  public tags: string[] = [];

  public setNumber: string = '';

  public cardImage: string = '';

  public retreat: CardType[] = [];

  public attacks: Attack[] = [];

  public powers: Power[] = [];

  static tags: any;

  public cards: CardList = new CardList;

  public marker = new Marker();

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
