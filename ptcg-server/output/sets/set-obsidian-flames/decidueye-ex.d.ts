import { PokemonCard, CardType, Stage, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Decidueyeex extends PokemonCard {
    cardType: CardType;
    stage: Stage;
    evolvesFrom: string;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
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
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly TOTAL_FREEDOM_MARKER = "TOTAL_FREEDOM_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
