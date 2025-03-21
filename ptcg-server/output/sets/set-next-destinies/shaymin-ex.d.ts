import { Attack, CardType, PokemonCard, Resistance, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class ShayminEX extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    tags: string[];
    hp: number;
    weakness: Weakness[];
    resistance: Resistance[];
    retreat: CardType[];
    attacks: Attack[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
