import { CardType, Direction, EnergyType, Format, SuperType } from './card-types';
import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { CardList } from '../state/card-list';
import { Marker } from '../state/card-marker';
export declare abstract class Card {
    abstract set: string;
    abstract superType: SuperType;
    abstract format: Format;
    abstract fullName: string;
    abstract name: string;
    energyType: EnergyType | undefined;
    id: number;
    regulationMark: string;
    tags: string[];
    setNumber: string;
    cardImage: string;
    retreat: CardType[];
    static tags: any;
    cards: CardList;
    marker: Marker;
    cardDirection: Direction[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
