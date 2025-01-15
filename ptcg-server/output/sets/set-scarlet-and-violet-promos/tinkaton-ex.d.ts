import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Tinkatonex extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: ({
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
        shredAttack?: undefined;
    } | {
        name: string;
        cost: CardType[];
        damage: number;
        shredAttack: boolean;
        text: string;
    })[];
    set: string;
    name: string;
    fullName: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
