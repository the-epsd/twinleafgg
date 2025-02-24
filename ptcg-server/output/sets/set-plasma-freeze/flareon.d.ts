import { Attack, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class Flareon extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: string[];
    cardType: CardType;
    hp: number;
    weakness: Weakness[];
    retreat: CardType[];
    attacks: Attack[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
