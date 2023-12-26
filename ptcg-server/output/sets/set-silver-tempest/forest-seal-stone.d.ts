import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { State, StoreLike, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class ForestSealStone extends TrainerCard {
    trainerType: TrainerType;
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    regulationMark: string;
    name: string;
    fullName: string;
    readonly VSTAR_MARKER = "VSTAR_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
    private buildAttackList;
    private checkAttack;
}
