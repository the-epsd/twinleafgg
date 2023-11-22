import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game';
export declare class HisuianGoodraVSTAR extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardTag: CardTag[];
    regulationMark: string;
    cardType: CardType;
    hp: number;
    retreat: CardType[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    set2: string;
    setNumber: string;
    name: string;
    fullName: string;
    ROLLING_IRON_MARKER: string;
    CLEAR_ROLLING_IRON_MARKER: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
