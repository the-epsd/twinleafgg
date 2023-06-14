import { SuperType } from './card-types';
import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
export declare abstract class Card {
    abstract set: string;
    abstract superType: SuperType;
    abstract fullName: string;
    abstract name: string;
    id: number;
    tags: string[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
