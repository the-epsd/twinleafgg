import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Koraidon extends PokemonCard {
    tags: CardTag[];
    regulationMark: string;
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: CardType.COLORLESS[];
    weakness: {
        type: CardType.PSYCHIC;
    }[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        damageCalculator: string;
        text: string;
    } | {
        name: string;
        cost: (CardType.FIGHTING | CardType.COLORLESS)[];
        damage: number;
        text: string;
        damageCalculator?: undefined;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly UNRELENTING_ONSLAUGHT_MARKER = "UNRELENTING_ONSLAUGHT_MARKER";
    readonly UNRELENTING_ONSLAUGHT_2_MARKER = "UNRELENTING_ONSLAUGHT_2_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
    private findOriginalCard;
}
