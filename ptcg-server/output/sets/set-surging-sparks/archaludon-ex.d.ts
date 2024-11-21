import { PokemonCard, CardTag, Stage, CardType, PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Archaludonex extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: {
        type: CardType.GRASS;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType.METAL[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly METAL_DEFENDER_MARKER = "METAL_DEFENDER_MARKER";
    readonly CLEAR_METAL_DEFENDER_MARKER = "CLEAR_METAL_DEFENDER_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
