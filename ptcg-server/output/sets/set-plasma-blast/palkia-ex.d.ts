import { Attack, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class PalkiaEX extends PokemonCard {
    stage: Stage;
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
    usedStrafe: boolean;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
