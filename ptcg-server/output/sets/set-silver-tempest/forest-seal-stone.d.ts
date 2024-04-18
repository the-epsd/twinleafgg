import { PowerType, State, StoreLike, TrainerCard } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
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
        exemptFromAbilityLock: boolean;
        text: string;
    }[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
