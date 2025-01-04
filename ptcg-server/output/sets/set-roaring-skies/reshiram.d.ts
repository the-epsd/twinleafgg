import { Power, State, StoreLike, Weakness } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class Reshiram extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    weakness: Weakness[];
    hp: number;
    retreat: CardType[];
    powers: Power[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    private readonly TURBOBLAZE_MARKER;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
