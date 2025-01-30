import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/game-effects';
export declare class TsareenaV extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    tags: string[];
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: Attack[];
    regulationMark: string;
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
