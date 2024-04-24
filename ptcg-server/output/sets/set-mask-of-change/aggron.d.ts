import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game';
export declare class Aggron extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    regulationMark: string;
    cardType: CardType;
    weakness: {
        type: CardType;
    }[];
    resistance: {
        type: CardType;
        value: number;
    }[];
    hp: number;
    retreat: CardType[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly GUARD_CLAW_MARKER = "GUARD_CLAW_MARKER";
    readonly CLEAR_GUARD_CLAW_MARKER = "CLEAR_GUARD_CLAW_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
