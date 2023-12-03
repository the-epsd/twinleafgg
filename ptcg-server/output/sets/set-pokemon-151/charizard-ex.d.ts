import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
export declare class Charizardex extends PokemonCard {
    regulationMark: string;
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
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
        effect: (store: StoreLike, state: State, effect: AttackEffect) => void;
    }[];
    set: string;
    set2: string;
    setNumber: string;
    name: string;
    fullName: string;
}
