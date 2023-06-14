import { Card } from './card';
import { SuperType, EnergyType } from './card-types';
export class EnergyCard extends Card {
    constructor() {
        super(...arguments);
        this.superType = SuperType.ENERGY;
        this.energyType = EnergyType.BASIC;
        this.provides = [];
        this.text = '';
    }
}
