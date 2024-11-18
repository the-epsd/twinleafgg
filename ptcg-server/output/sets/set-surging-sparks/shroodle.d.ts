import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
export declare class Shroodle extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.DARK[];
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
