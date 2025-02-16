import { Attack, CardType, PokemonCard, Power, Stage, State, StoreLike, Weakness } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class DeoxysEX extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    tags: string[];
    hp: number;
    weakness: Weakness[];
    retreat: CardType[];
    powers: Power[];
    attacks: Attack[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
