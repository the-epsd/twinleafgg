import { Attack, Resistance, State, StoreLike, Weakness } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class Mareep extends PokemonCard {
    set: string;
    setNumber: string;
    cardImage: string;
    fullName: string;
    name: string;
    cardType: CardType;
    stage: Stage;
    hp: number;
    weakness: Weakness[];
    resistance: Resistance[];
    retreat: CardType[];
    attacks: Attack[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
