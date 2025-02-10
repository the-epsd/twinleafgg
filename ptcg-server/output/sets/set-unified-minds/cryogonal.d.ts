import { CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Cryogonal extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.METAL;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.WATER[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    private readonly FROZEN_LOCK_MARKER;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
