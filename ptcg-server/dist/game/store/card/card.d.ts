import { CardType, EnergyType, Format, SuperType } from './card-types';
import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { CardList } from '../state/card-list';
import { Marker } from '../state/card-marker';
import { Attack, Power } from './pokemon-types';
import { Player } from '../state/player';
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
    attacks: Attack[];
    powers: Power[];
    static tags: any;
    cards: CardList;
    marker: Marker;
    /**
     * Optional method to check if card can be played without executing effects
     * Returns true if playable, false if not, undefined if check is too complex
     * (in which case we fall back to effect execution)
     */
    canPlay?(store: StoreLike, state: State, player: Player): boolean | undefined;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
