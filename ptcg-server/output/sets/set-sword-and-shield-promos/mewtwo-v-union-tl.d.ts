import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class MewtwoVUNIONTopLeft extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.DARK;
    }[];
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    powers: ({
        name: string;
        text: string;
        useFromDiscard: boolean;
        exemptFromAbilityLock: boolean;
        powerType: PowerType;
    } | {
        name: string;
        text: string;
        powerType: PowerType;
        useFromDiscard?: undefined;
        exemptFromAbilityLock?: undefined;
    })[];
    attacks: {
        name: string;
        cost: (CardType.PSYCHIC | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly MEWTWO_ASSEMBLED = "MEWTWO_ASSEMBLED";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
