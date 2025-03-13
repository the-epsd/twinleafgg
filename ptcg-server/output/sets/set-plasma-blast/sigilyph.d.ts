import { PokemonCard, Stage, CardType, PowerType } from '../../game';
export declare class Sigilyph extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    retreat: CardType.COLORLESS[];
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (CardType.PSYCHIC | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
}
