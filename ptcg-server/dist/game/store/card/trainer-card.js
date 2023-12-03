import { Card } from './card';
import { Format, SuperType, TrainerType } from './card-types';
export class TrainerCard extends Card {
    constructor() {
        super(...arguments);
        this.superType = SuperType.TRAINER;
        this.trainerType = TrainerType.ITEM;
        this.format = Format.NONE;
        this.text = '';
        this.powers = [];
    }
}
