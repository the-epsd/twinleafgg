import { CardType, PokemonCard, PowerType, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Eelektross extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    resistance: {
        type: CardType.METAL;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        useFromHand: boolean;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (CardType.LIGHTNING | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
