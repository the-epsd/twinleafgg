import { PowerType, TrainerCard } from '../../game';
import { CardType, PokemonType, Stage, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class ClefairyDoll extends TrainerCard {
    name: string;
    cardImage: string;
    setNumber: string;
    set: string;
    fullName: string;
    evolvesFrom: string;
    cardTag: never[];
    tools: never[];
    archetype: never[];
    trainerType: TrainerType;
    hp: number;
    stage: Stage;
    cardType: CardType;
    movedToActiveThisTurn: boolean;
    pokemonType: PokemonType;
    weakness: never[];
    resistance: never[];
    retreat: never[];
    attacks: never[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        exemptFromAbilityLock: boolean;
        text: string;
    }[];
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
