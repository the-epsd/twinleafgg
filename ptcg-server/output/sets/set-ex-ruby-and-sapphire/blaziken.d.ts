import { CardType, PokemonCard, PowerType, Stage } from "../../game";
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Blaziken extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.WATER;
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
        cost: (CardType.FIRE | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    readonly FIRESTARTER_MARKER = "FIRESTARTER_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
