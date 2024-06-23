import { Card } from './card';
import { SuperType, EnergyType, Format } from './card-types';
export class EnergyCard extends Card {
    constructor() {
        super(...arguments);
        this.superType = SuperType.ENERGY;
        this.energyType = EnergyType.BASIC;
        this.format = Format.NONE;
        this.provides = [];
        this.text = '';
        this.isBlocked = false;
        this.blendedEnergies = [];
    }
}
