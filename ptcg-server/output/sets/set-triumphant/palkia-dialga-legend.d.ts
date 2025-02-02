import { PokemonCard, Stage, CardType, CardTag, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class PalkiaDialgaLEGEND extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    cardType2: CardType;
    hp: number;
    retreat: CardType[];
    weakness: {
        type: CardType;
    }[];
    resistance: any[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    name: string;
    fullName: string;
    tags: CardTag[];
    setNumber: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
