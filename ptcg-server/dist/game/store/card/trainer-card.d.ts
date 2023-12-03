import { Power } from '../../..';
import { Card } from './card';
import { Format, SuperType, TrainerType } from './card-types';
export declare abstract class TrainerCard extends Card {
    superType: SuperType;
    trainerType: TrainerType;
    format: Format;
    text: string;
    powers: Power[];
}
