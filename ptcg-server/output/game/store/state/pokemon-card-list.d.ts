import { CardList } from './card-list';
import { Marker } from './card-marker';
import { SpecialCondition } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { Card } from '../card/card';
export declare class PokemonCardList extends CardList {
    damage: number;
    specialConditions: SpecialCondition[];
    poisonDamage: number;
    burnDamage: number;
    marker: Marker;
    pokemonPlayedTurn: number;
    tool: Card | undefined;
    getPokemons(): PokemonCard[];
    getPokemonCard(): PokemonCard | undefined;
    isBasic(): boolean;
    clearEffects(): void;
    removeSpecialCondition(sp: SpecialCondition): void;
    addSpecialCondition(sp: SpecialCondition): void;
}
