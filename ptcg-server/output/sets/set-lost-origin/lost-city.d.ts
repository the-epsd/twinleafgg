import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
export declare class LostCity extends TrainerCard {
    trainerType: TrainerType;
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    text: string;
    readonly LOST_CITY_MARKER = "LOST_CITY_MARKER";
}
