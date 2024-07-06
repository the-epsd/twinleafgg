import { TrainerCard, TrainerType, Stage, CardType, PokemonType, Power, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class MysteriousFossil extends TrainerCard {
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
    powers: Power[];
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
