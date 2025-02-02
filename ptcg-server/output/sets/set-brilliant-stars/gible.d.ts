import { PokemonCard, Stage } from '../../game';
export declare class Gible extends PokemonCard {
    stage: Stage;
    cardType: import("../../game").CardType.DRAGON;
    hp: number;
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (import("../../game").CardType.FIRE | import("../../game").CardType.WATER)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
}
