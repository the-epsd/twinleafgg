import { Attack, CardType, PokemonCard, Power, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Kricketune extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    powers: Power[];
    attacks: Attack[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    SWELLING_TUNE_MARKER: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
