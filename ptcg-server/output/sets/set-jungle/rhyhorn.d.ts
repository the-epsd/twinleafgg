import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Rhyhorn extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    resistance: {
        type: CardType;
        value: number;
    }[];
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: {
        name: string;
        cost: (CardType.FIGHTING | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = "DEFENDING_POKEMON_CANNOT_ATTACK_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
