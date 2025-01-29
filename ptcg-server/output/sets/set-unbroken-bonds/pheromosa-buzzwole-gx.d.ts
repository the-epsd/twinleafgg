import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class PheromosaBuzzwoleGX extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: (CardType.GRASS | CardType.COLORLESS)[];
        damage: number;
        text: string;
        shred?: undefined;
        gxAttack?: undefined;
    } | {
        name: string;
        cost: CardType.GRASS[];
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
    readonly ELEGANT_SOLE_MARKER = "ELEGANT_SOLE_MARKER";
    readonly ELEGANT_SOLE_MARKER_2 = "ELEGANT_SOLE_MARKER_2";
    private usedBaseBeastGame;
    private usedEnhancedBeastGame;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
