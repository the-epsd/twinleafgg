import { Card } from './card';
import { SuperType, CardType, EnergyType } from './card-types';
export declare abstract class EnergyCard extends Card {
    superType: SuperType;
    energyType: EnergyType;
    provides: CardType[];
    text: string;
}
