import { PokemonCard, State, StoreLike } from '../..';
import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
export declare class MysteriousFossil extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: never[];
    retreat: never[];
    text: string;
    attacks: never[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
