import { PokemonCard, Stage, CardType, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/game-effects';
export declare class Palafin extends PokemonCard {
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
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (CardType.WATER | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    regulationMark: string;
    cardImage: string;
    fullName: string;
    name: string;
    ABILITY_USED_MARKER: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
