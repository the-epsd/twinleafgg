import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class Farfetchd extends PokemonCard {
    name: string;
    set: string;
    fullName: string;
    stage: Stage;
    hp: number;
    cardImage: string;
    setNumber: string;
    cardType: CardType;
    weakness: {
        type: CardType;
    }[];
    resistance: {
        type: CardType;
        value: number;
    }[];
    retreat: CardType[];
    readonly LEEK_SLAP_MARKER = "LEEK_SLAP_MARKER";
    attacks: Attack[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
