import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class HoOhV extends PokemonCard {
    tags: CardTag[];
    regulationMark: string;
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: CardType[];
    powers: {
        name: string;
        useFromDiscard: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        damageCalculation: string;
        text: string;
    }[];
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    readonly NETHERWORLD_GATE_MARKER = "NETHERWORLD_GATE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
