import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class NaganadelGuzzlordGX extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FAIRY;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
    attacks: ({
        name: string;
        cost: (CardType.PSYCHIC | CardType.DARK | CardType.COLORLESS)[];
        damage: number;
        text: string;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        gxAttack: boolean;
        text: string;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly VIOLENT_APPETITE_MARKER = "VIOLENT_APPETITE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
