import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class GreninjaVUNIONTopLeft extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    retreat: CardType.COLORLESS[];
    powers: ({
        name: string;
        text: string;
        useFromDiscard: boolean;
        exemptFromAbilityLock: boolean;
        powerType: PowerType;
        useWhenInPlay?: undefined;
    } | {
        name: string;
        text: string;
        powerType: PowerType;
        useFromDiscard?: undefined;
        exemptFromAbilityLock?: undefined;
        useWhenInPlay?: undefined;
    } | {
        name: string;
        text: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        useFromDiscard?: undefined;
        exemptFromAbilityLock?: undefined;
    })[];
    attacks: {
        name: string;
        cost: (CardType.WATER | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly WATERFALL_BIND_MARKER = "WATERFALL_BIND_MARKER";
    readonly FEEL_THE_WAY_MARKER = "FEEL_THE_WAY_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
