import { PokemonCard, CardType, Stage, PowerType, State, StoreLike, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class DarkraiGX extends PokemonCard {
    cardType: CardType;
    tags: CardTag[];
    stage: Stage;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    resistance: {
        type: CardType;
        value: number;
    }[];
    retreat: CardType[];
    powers: {
        name: string;
        useFromDiscard: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: ({
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: CardType[];
        damage: number;
        gxAttack: boolean;
        text: string;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly NETHERWORLD_GATE_MARKER = "NETHERWORLD_GATE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
