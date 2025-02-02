import { CardType, PokemonCard, PowerType, Resistance, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class EelektrossUNM extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    resistance: Resistance[];
    retreat: CardType[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    powers: {
        name: string;
        powerType: PowerType;
        useFromHand: boolean;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
