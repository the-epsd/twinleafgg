import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
export declare class Ivysaur extends PokemonCard {
    regulationMark: string;
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
        effect: (store: StoreLike, state: State, effect: AttackEffect) => void;
    } | {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
        effect: undefined;
    })[];
    set: string;
    set2: string;
    setNumber: string;
    name: string;
    fullName: string;
}
