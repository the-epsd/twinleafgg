import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game';
export declare class Tatsugiriex extends PokemonCard {
    stage: Stage;
    regulationMark: string;
    cardType: CardType;
    hp: number;
    weakness: never[];
    resistance: never[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.WATER | CardType.FIGHTING)[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
