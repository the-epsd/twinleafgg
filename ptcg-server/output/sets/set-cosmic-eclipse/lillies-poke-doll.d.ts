import { Power, State, StoreLike, TrainerCard } from '../..';
import { CardType, PokemonType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
export declare class LilliesPokeDoll extends TrainerCard {
    trainerType: TrainerType;
    superType: SuperType;
    stage: Stage;
    cardType: CardType;
    cardTypez: CardType;
    movedToActiveThisTurn: boolean;
    pokemonType: PokemonType;
    evolvesFrom: string;
    cardTag: never[];
    tools: never[];
    archetype: never[];
    hp: number;
    weakness: never[];
    retreat: never[];
    resistance: never[];
    attacks: never[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    powers: Power[];
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
