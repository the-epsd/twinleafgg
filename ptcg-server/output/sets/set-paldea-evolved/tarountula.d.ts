import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
export declare class Tarountula extends PokemonCard {
    stage: Stage;
    cardType: import("../../game/store/card/card-types").CardType.GRASS;
    hp: number;
    weakness: {
        type: import("../../game/store/card/card-types").CardType.FIRE;
    }[];
    retreat: import("../../game/store/card/card-types").CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: import("../../game/store/card/card-types").CardType.GRASS[];
        damage: number;
        text: string;
    }[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
}
