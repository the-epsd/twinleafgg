import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
export declare class Ponyta extends PokemonCard {
    name: string;
    cardImage: string;
    set: string;
    setNumber: string;
    cardType: CardType;
    fullName: string;
    stage: Stage;
    evolvesInto: string[];
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: Attack[];
}
