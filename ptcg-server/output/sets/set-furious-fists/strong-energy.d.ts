import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class StrongEnergy extends EnergyCard {
    provides: CardType[];
    energyType: EnergyType;
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    readonly STRONG_ENERGY_MAREKER = "STRONG_ENERGY_MAREKER";
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
