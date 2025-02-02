import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike, State } from '../../game';
export declare class Meditite extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.PSYCHIC;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    evolvesInto: string;
    attacks: {
        name: string;
        cost: (CardType.FIGHTING | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    name: string;
    fullName: string;
    setNumber: string;
    cardImage: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
