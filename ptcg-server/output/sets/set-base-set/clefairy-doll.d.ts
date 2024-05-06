import { PokemonCard, PowerType } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class ClefairyDoll extends PokemonCard {
    name: string;
    setNumber: string;
    set: string;
    fullName: string;
    stage: Stage;
    hp: number;
    cardType: CardType;
    attacks: never[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        exemptFromAbilityLock: boolean;
        text: string;
    }[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
