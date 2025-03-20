import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class LuxrayV extends PokemonCard {
    cardType: import("../../game").CardType.LIGHTNING;
    tags: CardTag[];
    stage: Stage;
    hp: number;
    weakness: {
        type: import("../../game").CardType.FIGHTING;
    }[];
    resistance: never[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (import("../../game").CardType.LIGHTNING | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
