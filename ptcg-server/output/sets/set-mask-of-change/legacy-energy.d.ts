import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { EnergyCard, CardType, EnergyType, CardTag } from '../../game';
export declare class LegacyEnergy extends EnergyCard {
    provides: CardType[];
    energyType: EnergyType;
    tags: CardTag[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
