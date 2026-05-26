import { CardTarget, SlotType } from './actions/play-card-action';
import { Card } from './card/card';
import { CardType } from './card/card-types';
import { PokemonCard } from './card/pokemon-card';
import { EnergyMap } from './prompts/choose-energy-prompt';
import { CardList } from './state/card-list';
import { Player } from './state/player';
import { PokemonCardList } from './state/pokemon-card-list';
import { State } from './state/state';
export declare class StateUtils {
    static getStadium(state: State): void;
    static checkEnoughEnergy(energy: EnergyMap[], cost: CardType[]): boolean;
    static getCombinations(arr: CardType[][], n: number): CardType[][];
    static checkExactEnergy(energy: EnergyMap[], cost: CardType[]): boolean;
    /**
     * Returns true when every energy entry has the same provides array.
     * Used to skip the energy selection prompt when all options are interchangeable.
     */
    static allEnergyProvidesIdentical(energyMap: EnergyMap[]): boolean;
    /**
     * Returns a minimal set of EnergyMap entries that satisfies the cost, or null if impossible.
     * Satisfies typed costs first, then colorless, then trims excess.
     */
    static selectMinimalEnergyForCost(energyMap: EnergyMap[], cost: CardType[]): EnergyMap[] | null;
    static getPlayerById(state: State, playerId: number): Player;
    static getOpponent(state: State, player: Player): Player;
    static getTarget(state: State, player: Player, target: CardTarget): PokemonCardList;
    static findCardList(state: State, card: Card): CardList;
    static findPokemonSlot(state: State, card: Card): PokemonCardList | undefined;
    static findOwner(state: State, cardList: CardList): Player;
    static isPokemonInPlay(player: Player, pokemon: PokemonCard, location?: SlotType.BENCH | SlotType.ACTIVE): boolean;
    static getStadiumCard(state: State): Card | undefined;
}
