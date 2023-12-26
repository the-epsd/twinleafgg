import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
export declare class GiftEnergy extends EnergyCard {
    provides: CardType[];
    energyType: EnergyType;
    set: string;
    cardImage: string;
    setNumber: string;
    regulationMark: string;
    name: string;
    fullName: string;
    readonly GIFT_ENERGY_MARKER = "GIFT_ENERGY_MARKER";
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
