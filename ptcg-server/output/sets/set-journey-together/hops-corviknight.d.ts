import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class HopsCorviknight extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.METAL | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = "DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER";
    readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = "CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
