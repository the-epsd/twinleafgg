import { CardTarget } from './actions/play-card-action';
import { Card } from './card/card';
import { CardType } from './card/card-types';
import { EnergyMap } from './prompts/choose-energy-prompt';
import { CardList } from './state/card-list';
import { Player } from './state/player';
import { PokemonCardList } from './state/pokemon-card-list';
import { State } from './state/state';
export declare class StateUtils {
    static getStadium(state: State): void;
    static checkEnoughEnergy(energyMap: EnergyMap[], cost: CardType[]): boolean;
    /**
     * Uses backtracking and recursion to find a valid assignment of Energy cards to hued costs
     * @param provided Array of what each Energy card can provide (e.g. [[L,P,M], [W,L,F,M]])
     * @param needed Array of required hued Energy (e.g. [L,P])
     * @returns boolean indicating whether a valid assignment was found
     */
    private static canFulfillCosts;
    static checkExactEnergy(energy: EnergyMap[], cost: CardType[]): boolean;
    static getPlayerById(state: State, playerId: number): Player;
    static getOpponent(state: State, player: Player): Player;
    static getTarget(state: State, player: Player, target: CardTarget): PokemonCardList;
    static findCardList(state: State, card: Card): CardList;
    static findOwner(state: State, cardList: CardList): Player;
    static getStadiumCard(state: State): Card | undefined;
}
