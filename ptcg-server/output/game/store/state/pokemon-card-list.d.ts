import { CardList } from './card-list';
import { Marker } from './card-marker';
import { SpecialCondition } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { Card } from '../card/card';
import { Power, Attack } from '../card/pokemon-types';
export declare class PokemonCardList extends CardList {
    damage: number;
    specialConditions: SpecialCondition[];
    poisonDamage: number;
    burnDamage: number;
    marker: Marker;
    attackMarker: Marker;
    abilityMarker: Marker;
    pokemonPlayedTurn: number;
    tool: Card | undefined;
    stadium: Card | undefined;
    getPokemons(): PokemonCard[];
    getPokemonCard(): PokemonCard | undefined;
    isBasic(): boolean;
    clearAttackEffects(): void;
    clearEffects(): void;
    removeSpecialCondition(sp: SpecialCondition): void;
    addSpecialCondition(sp: SpecialCondition): void;
    hasRuleBox(): boolean;
    vPokemon(): boolean;
    getToolEffect(): Power | Attack | undefined;
}
