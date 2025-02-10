import { Attack, CardType, PokemonCard, Resistance, Stage, State, StoreLike, Weakness } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class TalonflameV extends PokemonCard {
    stage: Stage;
    tags: string[];
    cardType: CardType;
    hp: number;
    weakness: Weakness[];
    resistance: Resistance[];
    retreat: CardType[];
    attacks: Attack[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
