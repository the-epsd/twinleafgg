import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game';
export declare class Clefairy extends PokemonCard {
    stage: Stage;
    regulationMark: string;
    cardType: CardType;
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
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
}
