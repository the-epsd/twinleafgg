import { PokemonCard, Stage, CardTag } from "../../game";
export declare class EthansSlugma extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: import("../../game").CardType.FIRE;
    hp: number;
    weakness: {
        type: import("../../game").CardType.WATER;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: import("../../game").CardType.FIRE[];
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
