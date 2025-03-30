import { Attack, CardType, PokemonCard, Resistance, Stage, Weakness } from '../../game';
export declare class Metang extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: Weakness[];
    resistance: Resistance[];
    retreat: CardType[];
    attacks: Attack[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
}
