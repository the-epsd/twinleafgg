import { Attack, CardType, PokemonCard, Stage, State, StoreLike } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class TapuKoko extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: Attack[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
