import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class NoivernGX extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FAIRY;
    }[];
    retreat: never[];
    attacks: ({
        name: string;
        cost: (CardType.PSYCHIC | CardType.DARK | CardType.COLORLESS)[];
        damage: number;
        text: string;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: (CardType.PSYCHIC | CardType.DARK | CardType.COLORLESS)[];
        damage: number;
        gxAttack: boolean;
        text: string;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = "OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER";
    readonly OPPONENT_CANNOT_PLAY_SPECIAL_ENERGY_MARKER = "OPPONENT_CANNOT_PLAY_SPECIAL_ENERGY_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
