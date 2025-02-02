import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
export declare class Machop extends PokemonCard {
    name: string;
    cardImage: string;
    set: string;
    setNumber: string;
    fullName: string;
    cardType: CardType;
    stage: Stage;
    retreat: CardType[];
    hp: number;
    weakness: {
        type: CardType;
    }[];
    attacks: Attack[];
}
