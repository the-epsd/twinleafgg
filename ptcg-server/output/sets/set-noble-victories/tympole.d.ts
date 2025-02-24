import { Attack, CardType, PokemonCard, Stage, Weakness } from "../../game";
export declare class Tympole extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: Weakness[];
    retreat: CardType[];
    attacks: Attack[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
}
