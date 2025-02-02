import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class DialgaGX extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: ({
        name: string;
        cost: CardType.METAL[];
        damage: number;
        text: string;
        shredAttack?: undefined;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: (CardType.METAL | CardType.COLORLESS)[];
        damage: number;
        shredAttack: boolean;
        text: string;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: (CardType.METAL | CardType.COLORLESS)[];
        damage: number;
        gxAttack: boolean;
        text: string;
        shredAttack?: undefined;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly TIMELESS_GX_MARKER = "TIMELESS_GX_MARKER";
    readonly TIMELESS_GX_MARKER_2 = "TIMELESS_GX_MARKER_2";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
