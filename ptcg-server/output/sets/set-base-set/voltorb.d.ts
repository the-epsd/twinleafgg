import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
export declare class Voltorb extends PokemonCard {
    name: string;
    cardImage: string;
    setNumber: string;
    set: string;
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
