import { PokemonCard, Stage, PowerType, StoreLike, State, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class EthansQuilava extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: import("../../game").CardType.FIRE;
    hp: number;
    weakness: {
        type: import("../../game").CardType.WATER;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: import("../../game").CardType.FIRE[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly ADVENTURE_BOUND_MARKER = "ADVENTURE_BOUND";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
