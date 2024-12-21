import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
export declare class Alakazamex extends PokemonCard {
    regulationMark: string;
    tags: CardTag[];
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
        useOnBench?: undefined;
    } | {
        name: string;
        cost: never[];
        damage: number;
        useOnBench: boolean;
        text: string;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
}
