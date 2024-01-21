import { TrainerType } from '../../game/store/card/card-types';
import { PowerType, TrainerCard } from '../../game';
export declare class ForestSealStone extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    cardImage: string;
    setNumber: string;
    regulationMark: string;
    name: string;
    fullName: string;
    useWhenAttached: boolean;
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
}
