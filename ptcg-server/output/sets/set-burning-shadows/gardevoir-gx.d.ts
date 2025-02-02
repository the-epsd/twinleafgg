import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class GardevoirGX extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    resistance: {
        type: CardType;
        value: number;
    }[];
    retreat: CardType[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: ({
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: CardType[];
        damage: number;
        gxAttack: boolean;
        text: string;
    })[];
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    readonly SPRING_MARKER = "SPRING_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
