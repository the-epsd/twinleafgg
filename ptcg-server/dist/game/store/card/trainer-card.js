import { Card } from './card';
import { SuperType, TrainerType } from './card-types';
export class TrainerCard extends Card {
    constructor() {
        super(...arguments);
        this.superType = SuperType.TRAINER;
        this.trainerType = TrainerType.ITEM;
        this.text = '';
    }
}
