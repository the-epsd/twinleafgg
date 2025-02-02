import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game';
export declare class WeavileGX extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    resistance: {
        type: CardType.PSYCHIC;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (CardType.DARK | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    name: string;
    fullName: string;
    setNumber: string;
    cardImage: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
