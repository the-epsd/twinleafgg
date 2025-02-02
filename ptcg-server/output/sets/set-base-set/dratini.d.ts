import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
export declare class Dratini extends PokemonCard {
    name: string;
    set: string;
    fullName: string;
    stage: Stage;
    cardImage: string;
    setNumber: string;
    hp: number;
    cardType: CardType;
    resistance: {
        type: CardType;
        value: number;
    }[];
    retreat: CardType[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
}
