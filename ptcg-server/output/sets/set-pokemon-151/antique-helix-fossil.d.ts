import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PowerType } from '../../game';
export declare class AntiqueHelixFossil extends PokemonCard {
    superType: SuperType;
    regulationMark: string;
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: CardType[];
    text: string;
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
}
