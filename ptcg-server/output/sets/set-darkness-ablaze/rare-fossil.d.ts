import { CardType, PokemonType, Power, Stage, State, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class RareFossil extends TrainerCard {
    trainerType: TrainerType;
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
    regulationMark: string;
    powers: Power[];
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
