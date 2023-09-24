import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
export declare class Charmander extends PokemonCard {
    regulationMark: string;
    stage: Stage;
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
        reduceEffect: (store: StoreLike, state: State, effect: AttackEffect) => void;
        effect?: undefined;
    } | {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
        effect: undefined;
        reduceEffect?: undefined;
    })[];
    set: string;
    name: string;
    fullName: string;
}
