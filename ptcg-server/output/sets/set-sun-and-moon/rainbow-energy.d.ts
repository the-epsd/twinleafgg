import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
export declare class RainbowEnergy extends EnergyCard {
    provides: CardType[];
    energyType: EnergyType;
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
