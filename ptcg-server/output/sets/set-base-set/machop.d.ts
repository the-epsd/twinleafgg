import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
export declare class Machop extends PokemonCard {
    name: string;
    set: string;
    setNumber: string;
    fullName: string;
    cardType: CardType;
    stage: Stage;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreatCost: {
        type: CardType;
    }[];
    attacks: Attack[];
}
