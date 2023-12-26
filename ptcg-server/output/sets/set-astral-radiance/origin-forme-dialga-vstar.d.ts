import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class OriginFormeDialgaVSTAR extends PokemonCard {
    tags: CardTag[];
    regulationMark: string;
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: never[];
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
    readonly VSTAR_MARKER = "VSTAR_MARKER";
    readonly STAR_CHRONOS_MARKER = "STAR_CHRONOS_MARKER";
    readonly STAR_CHRONOS_MARKER_2 = "STAR_CHRONOS_MARKER_2";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
