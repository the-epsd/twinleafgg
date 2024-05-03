import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class Pidgeotto extends PokemonCard {
    set: string;
    fullName: string;
    name: string;
    stage: Stage;
    evolvesFrom: string;
    cardImage: string;
    setNumber: string;
    hp: number;
    cardType: CardType;
    weakness: {
        type: CardType;
    }[];
    resistance: {
        type: CardType;
        value: number;
    }[];
    retreat: CardType[];
    private mirrorMoveEffects;
    attacks: Attack[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
