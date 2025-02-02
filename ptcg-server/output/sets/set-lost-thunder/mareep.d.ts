import { PowerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class Mareep extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    resistance: {
        type: CardType;
        value: number;
    }[];
    retreat: CardType[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
        useWhenInPlay: boolean;
    }[];
    set: string;
    fullName: string;
    name: string;
    setNumber: string;
    cardImage: string;
    FLUFFY_PILLOW_MARKER: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
