import { PokemonCard, CardTag, Stage, CardType, PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class RadiantEternatus extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: never[];
    resistance: never[];
    retreat: CardType[];
    powers: {
        name: string;
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
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
