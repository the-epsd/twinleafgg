import { PokemonCard, Stage, CardType, StoreLike, State, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class VenusaurVMAX extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType;
    evolvesFrom: string;
    weakness: {
        type: CardType;
    }[];
    hp: number;
    retreat: CardType[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
