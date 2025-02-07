import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class JirachiPrismStar extends PokemonCard {
    stage: Stage;
    tags: string[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: {
        type: CardType.PSYCHIC;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        exemptFromAbilityLock: boolean;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly KNOCKOUT_MARKER = "KNOCKOUT_MARKER";
    readonly CLEAR_KNOCKOUT_MARKER = "CLEAR_KNOCKOUT_MARKER";
    abilityUsed: boolean;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
    private handlePrizeEffect;
}
