import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Dhelmise extends PokemonCard {
    tags: never[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly ATTACK_USED_MARKER = "ATTACK_USED_MARKER";
    readonly ATTACK_USED_2_MARKER = "ATTACK_USED_2_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
