import { Attack, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class Magby extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: Weakness[];
    retreat: CardType[];
    attacks: Attack[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly SCORCHING_HEATER_MARKER = "SCORCHING_HEATER_MARKER";
    readonly CLEAR_SCORCHING_HEATER_MARKER = "CLEAR_SCORCHING_HEATER_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
