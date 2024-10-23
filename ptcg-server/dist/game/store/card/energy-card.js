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
        // public getEnergies(): EnergyCard[] {
        //   const result: EnergyCard[] = [];
        //   for (const card of this.cards.cards) {
        //     if (card.superType === SuperType.ENERGY) {
        //       result.push(card as EnergyCard);
        //     } else if (card.name === 'Electrode') {
        //       result.push(card as EnergyCard);
        //     }
        //   }
        //   return result;
        // }
    }
}
