import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, Power } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Slakingex extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: string[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    powers: Power[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    regulationMark: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
