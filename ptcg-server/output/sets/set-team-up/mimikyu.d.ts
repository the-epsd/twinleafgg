import { CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Mimikyu extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: never[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
        copycatAttack?: undefined;
    } | {
        name: string;
        cost: (CardType.COLORLESS | CardType.FAIRY)[];
        damage: number;
        copycatAttack: boolean;
        text: string;
    })[];
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
    private executeCopiedAttack;
    private findOriginalCard;
}
