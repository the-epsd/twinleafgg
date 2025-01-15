import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game';
export declare class GiratinaV extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    regulationMark: string;
    cardType: CardType;
    hp: number;
    retreat: CardType[];
    attacks: ({
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
        shredAttack?: undefined;
    } | {
        name: string;
        cost: CardType[];
        damage: number;
        shredAttack: boolean;
        text: string;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly FLOWER_SELECTING_MARKER = "FLOWER_SELECTING_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
