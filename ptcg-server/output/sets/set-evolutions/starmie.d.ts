import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack, PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Starmie extends PokemonCard {
    name: string;
    cardImage: string;
    set: string;
    evolvesFrom: string;
    fullName: string;
    setNumber: string;
    cardType: CardType;
    stage: Stage;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
    attacks: Attack[];
    readonly SPACE_BEACON_MARKER = "SPACE_BEACON_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
