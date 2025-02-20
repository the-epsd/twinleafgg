import { Attack, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class Rotom extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: Weakness[];
    retreat: CardType[];
    attacks: Attack[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
