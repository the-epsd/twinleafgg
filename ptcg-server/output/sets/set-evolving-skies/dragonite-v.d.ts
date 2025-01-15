import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class DragoniteV extends PokemonCard {
    regulationMark: string;
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: never[];
    retreat: CardType[];
    attacks: ({
        name: string;
        cost: CardType[];
        damage: number;
        shredAttack: boolean;
        text: string;
    } | {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
        shredAttack?: undefined;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
