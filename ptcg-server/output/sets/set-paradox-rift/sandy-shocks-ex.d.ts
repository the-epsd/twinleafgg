import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game';
export declare class SandyShocksex extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: import("../../game").CardType.FIGHTING;
    hp: number;
    weakness: {
        type: import("../../game").CardType.GRASS;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (import("../../game").CardType.FIGHTING | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly ATTACK_USED_MARKER = "ATTACK_USED_MARKER";
    readonly ATTACK_USED_2_MARKER = "ATTACK_USED_2_MARKER";
    readonly MAGNETIC_ABSORPTION_MARKER = "MAGNETIC_ABSORPTION_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
