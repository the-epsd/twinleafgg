import { Attack, CardType, PokemonCard, Power, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Maractus extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: Weakness[];
    retreat: CardType[];
    powers: Power[];
    attacks: Attack[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
