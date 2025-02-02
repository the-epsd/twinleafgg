import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, PowerType } from '../../game';
export declare class Tatsugiri extends PokemonCard {
    stage: Stage;
    regulationMark: string;
    cardType: CardType;
    hp: number;
    weakness: never[];
    resistance: never[];
    retreat: CardType[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly CROWD_PULLER_MARKER = "CROWD_PULLER_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
