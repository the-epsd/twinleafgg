import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/game-effects';
import { State, StoreLike } from '../../game';
export declare class HopsSilicobra extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.GRASS;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.FIGHTING | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
