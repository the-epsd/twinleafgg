import { PokemonCard, Stage, CardType, Resistance, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Capsakid extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    resistance: Resistance[];
    retreat: CardType[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    set: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
