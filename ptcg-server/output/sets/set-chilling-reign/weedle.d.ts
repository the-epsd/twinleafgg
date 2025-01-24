import { CardTag, CardType, PokemonCard, Stage } from '../../game';
export declare class WeedleCRE extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    set: string;
    setNumber: string;
    cardImage: string;
    regulationMark: string;
    name: string;
    fullName: string;
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
}
