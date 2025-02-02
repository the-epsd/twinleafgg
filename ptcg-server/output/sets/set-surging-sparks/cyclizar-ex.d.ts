import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StoreLike, State, CardTag, CardType, Stage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Cyclizarex extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: (CardType.GRASS | CardType.FIRE | CardType.PSYCHIC)[];
        damage: number;
        text: string;
    })[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
