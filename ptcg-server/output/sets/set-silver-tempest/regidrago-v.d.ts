import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class RegidragoV extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    retreat: CardType[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    set2: string;
    setNumber: string;
    regulationMark: string;
    name: string;
    fullName: string;
    readonly FLEET_FOOTED_MARKER = "FLEET_FOOTED_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
