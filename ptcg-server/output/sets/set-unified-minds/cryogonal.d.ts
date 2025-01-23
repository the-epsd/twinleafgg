import { CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class CryogonalUNM extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    private readonly FROZEN_LOCK_MARKER;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
