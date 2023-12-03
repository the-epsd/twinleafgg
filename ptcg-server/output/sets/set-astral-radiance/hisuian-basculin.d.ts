import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
export declare class HisuianBasculin extends PokemonCard {
    regulationMark: string;
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: {
        name: string;
        cost: never[];
        damage: number;
        text: string;
    }[];
    set: string;
    set2: string;
    setNumber: string;
    name: string;
    fullName: string;
}
