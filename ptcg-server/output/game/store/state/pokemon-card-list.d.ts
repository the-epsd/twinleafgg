import { Card } from '../card/card';
import { BoardEffect, SpecialCondition, Stage } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { Power, Attack } from '../card/pokemon-types';
import { CardList } from './card-list';
import { Marker } from './card-marker';
export declare class PokemonCardList extends CardList {
    damage: number;
    hp: number;
    specialConditions: SpecialCondition[];
    poisonDamage: number;
    burnDamage: number;
    marker: Marker;
    pokemonPlayedTurn: number;
    sleepFlips: number;
    boardEffect: BoardEffect[];
    hpBonus: number;
    tool: Card | undefined;
    energyCards: Card[];
    stadium: Card | undefined;
    isActivatingCard: boolean;
    attacksThisTurn?: number;
    showAllStageAbilities: boolean;
    static readonly ATTACK_USED_MARKER = "ATTACK_USED_MARKER";
    static readonly ATTACK_USED_2_MARKER = "ATTACK_USED_2_MARKER";
    static readonly CLEAR_KNOCKOUT_MARKER = "CLEAR_KNOCKOUT_MARKER";
    static readonly CLEAR_KNOCKOUT_MARKER_2 = "CLEAR_KNOCKOUT_MARKER_2";
    static readonly KNOCKOUT_MARKER = "KNOCKOUT_MARKER";
    static readonly PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN = "PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN";
    static readonly CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN = "CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN";
    static readonly PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN = "PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN";
    static readonly CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN = "CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN";
    static readonly OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER = "OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER";
    static readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = "DEFENDING_POKEMON_CANNOT_RETREAT_MARKER";
    static readonly PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = "PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER";
    static readonly CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = "CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER";
    static readonly DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = "DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER";
    static readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = "CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER";
    static readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = "DEFENDING_POKEMON_CANNOT_ATTACK_MARKER";
    static readonly DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = "DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER";
    static readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = "CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER";
    static readonly PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: string;
    static readonly CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: string;
    static readonly PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER = "PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER";
    static readonly OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = "OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER";
    static readonly PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = "PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER";
    static readonly CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = "CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER";
    static readonly UNRELENTING_ONSLAUGHT_MARKER = "UNRELENTING_ONSLAUGHT_MARKER";
    static readonly UNRELENTING_ONSLAUGHT_2_MARKER = "UNRELENTING_ONSLAUGHT_2_MARKER";
    getPokemons(): PokemonCard[];
    getPokemonCard(): PokemonCard | undefined;
    isStage(stage: Stage): boolean;
    clearAttackEffects(): void;
    clearEffects(): void;
    clearAllSpecialConditions(): void;
    removeSpecialCondition(sp: SpecialCondition): void;
    addSpecialCondition(sp: SpecialCondition): void;
    removeBoardEffect(sp: BoardEffect): void;
    addBoardEffect(sp: BoardEffect): void;
    addPokemonAsEnergy(card: Card): void;
    removePokemonAsEnergy(card: Card): void;
    hasRuleBox(): boolean;
    vPokemon(): boolean;
    exPokemon(): boolean;
    isTera(): boolean;
    singleStrikePokemon(): boolean;
    rapidStrikePokemon(): boolean;
    fusionStrikePokemon(): boolean;
    futurePokemon(): boolean;
    ancientPokemon(): boolean;
    isLillies(): boolean;
    isNs(): boolean;
    isIonos(): boolean;
    isHops(): boolean;
    isEthans(): boolean;
    getToolEffect(): Power | Attack | undefined;
    moveTo(destination: CardList, count?: number): void;
}
