import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class HisuianElectrodeV extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    tags: CardTag[];
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    SOLAR_SHOT_MARKER: string;
    CLEAR_SOLAR_SHOT_MARKER: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
