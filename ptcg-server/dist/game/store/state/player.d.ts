import { CardList } from './card-list';
import { CardTarget, PlayerType } from '../actions/play-card-action';
import { PokemonCard } from '../card/pokemon-card';
import { PokemonCardList } from './pokemon-card-list';
import { Marker } from './card-marker';
export declare class Player {
    id: number;
    name: string;
    deck: CardList;
    hand: CardList;
    discard: CardList;
    stadium: CardList;
    supporter: CardList;
    active: PokemonCardList;
    bench: PokemonCardList[];
    prizes: CardList[];
    retreatedTurn: number;
    energyPlayedTurn: number;
    stadiumPlayedTurn: number;
    stadiumUsedTurn: number;
    marker: Marker;
    avatarName: string;
    getPrizeLeft(): number;
    forEachPokemon(player: PlayerType, handler: (cardList: PokemonCardList, pokemonCard: PokemonCard, target: CardTarget) => void): void;
    switchPokemon(target: PokemonCardList): void;
}
