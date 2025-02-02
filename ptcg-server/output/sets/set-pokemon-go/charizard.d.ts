import { Attack, Power, Resistance, State, StoreLike, Weakness } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class Charizard extends PokemonCard {
    set: string;
    setNumber: string;
    stage: Stage;
    cardImage: string;
    fullName: string;
    name: string;
    cardType: CardType;
    evolvesFrom: string;
    hp: number;
    weakness: Weakness[];
    resistance: Resistance[];
    retreat: CardType[];
    regulationMark: string;
    powers: Power[];
    attacks: Attack[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
