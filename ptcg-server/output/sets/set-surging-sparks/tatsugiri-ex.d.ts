import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game';
export declare class Tatsugiriex extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    regulationMark: string;
    cardType: CardType;
    hp: number;
    weakness: never[];
    resistance: never[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: (CardType.FIRE | CardType.WATER)[];
        damage: number;
        shredAttack: boolean;
        text: string;
    } | {
        name: string;
        cost: (CardType.FIRE | CardType.WATER | CardType.DARK)[];
        damage: number;
        text: string;
        shredAttack?: undefined;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
