import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class GreedentVMAX extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    tags: CardTag[];
    weakness: {
        type: CardType.FIGHTING;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    private usedTurnAProfit;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
