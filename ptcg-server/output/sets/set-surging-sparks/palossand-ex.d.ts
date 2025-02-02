import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Palossandex extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
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
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: (CardType.WATER | CardType.PSYCHIC | CardType.FIGHTING)[];
        damage: number;
        text: string;
    })[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly SAND_TOMB_MARKER = "SAND_TOMB_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
