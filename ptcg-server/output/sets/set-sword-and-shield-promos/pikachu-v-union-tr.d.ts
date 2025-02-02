import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { Power, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/game-effects';
export declare class PikachuVUNIONTopRight extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    retreat: CardType.COLORLESS[];
    powers: Power[];
    attacks: {
        name: string;
        cost: (CardType.LIGHTNING | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
