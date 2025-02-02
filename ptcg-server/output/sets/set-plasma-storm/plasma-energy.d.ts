import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
export declare class PlasmaEnergy extends EnergyCard {
    provides: CardType[];
    energyType: EnergyType;
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    text: string;
}
