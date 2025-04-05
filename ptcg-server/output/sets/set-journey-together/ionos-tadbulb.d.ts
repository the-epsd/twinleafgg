import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
export declare class IonosTadbulb extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.LIGHTNING | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    cardImage: string;
    set: string;
    setNumber: string;
    name: string;
    fullName: string;
}
