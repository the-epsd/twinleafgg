import { CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Mimikyu extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: never[];
    retreat: CardType[];
    attacks: ({
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
        copycatAttack?: undefined;
    } | {
        name: string;
        cost: CardType[];
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
