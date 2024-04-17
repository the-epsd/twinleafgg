import { PowerType, TrainerCard } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
export declare class ForestSealStone extends TrainerCard {
    trainerType: TrainerType;
    set: string;
    cardImage: string;
    setNumber: string;
    regulationMark: string;
    name: string;
    fullName: string;
    useWhenAttached: boolean;
    readonly VSTAR_MARKER = "VSTAR_MARKER";
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
}
