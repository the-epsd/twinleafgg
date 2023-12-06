import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AttackEffect } from '../../game/store/effects/game-effects';
export declare class HisuianBasculin extends PokemonCard {
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
        cost: never[];
        damage: number;
        text: string;
        effect: (store: StoreLike, state: State, effect: AttackEffect) => void;
    } | {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
        effect?: undefined;
    })[];
    set: string;
    set2: string;
    setNumber: string;
    name: string;
    fullName: string;
}
