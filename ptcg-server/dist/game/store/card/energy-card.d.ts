import { EnergyEffect } from '../effects/play-card-effects';
import { Card } from './card';
import { SuperType, CardType, EnergyType, Format } from './card-types';
export declare abstract class EnergyCard extends Card {
    superType: SuperType;
    energyType: EnergyType;
    format: Format;
    provides: CardType[];
    text: string;
    isBlocked: boolean;
    blendedEnergies: CardType[];
    energyEffect: EnergyEffect | undefined;
}
