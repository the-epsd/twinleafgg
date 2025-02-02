import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class ReshiramCharizardGX extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: ({
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
        shred?: undefined;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: CardType[];
        damage: number;
        shred: boolean;
        gxAttack: boolean;
        text: string;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly ATTACK_USED_MARKER = "ATTACK_USED_MARKER";
    readonly ATTACK_USED_2_MARKER = "ATTACK_USED_2_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
