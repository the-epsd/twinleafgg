import { State, StoreLike, TrainerCard } from '../..';
import { CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
export declare class LilliesPokeDoll extends TrainerCard {
    trainerType: TrainerType;
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: never[];
    retreat: never[];
    attacks: never[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
