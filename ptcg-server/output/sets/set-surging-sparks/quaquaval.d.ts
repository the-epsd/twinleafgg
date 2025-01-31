import { PokemonCard, Stage, CardType, State, StoreLike, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Quaquaval extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.LIGHTNING;
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
        cost: (CardType.WATER | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly UP_TEMPO_MARKER = "UP_TEMPO_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
