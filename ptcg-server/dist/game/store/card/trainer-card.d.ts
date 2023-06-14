import { Card } from './card';
import { SuperType, TrainerType } from './card-types';
export declare abstract class TrainerCard extends Card {
    superType: SuperType;
    trainerType: TrainerType;
    text: string;
}
