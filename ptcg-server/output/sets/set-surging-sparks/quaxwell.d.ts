import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
export declare class Quaxwell extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    evolvesFrom: string;
    hp: number;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.WATER[];
        damage: number;
        text: string;
    }[];
    set: string;
    name: string;
    fullName: string;
    regulationMark: string;
    setNumber: string;
    cardImage: string;
}
