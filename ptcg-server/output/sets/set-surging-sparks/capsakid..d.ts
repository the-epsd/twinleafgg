import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
export declare class Capsakid extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.COLORLESS[];
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
