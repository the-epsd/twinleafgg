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
    static checkEnoughEnergy(energy: EnergyMap[], cost: CardType[]): boolean;
    static getCombinations(arr: CardType[][], n: number): CardType[][];
    static checkExactEnergy(energy: EnergyMap[], cost: CardType[]): boolean;
    static getPlayerById(state: State, playerId: number): Player;
    static getOpponent(state: State, player: Player): Player;
    static getTarget(state: State, player: Player, target: CardTarget): PokemonCardList;
    static findCardList(state: State, card: Card): CardList;
    static findOwner(state: State, cardList: CardList): Player;
    static getStadiumCard(state: State): Card | undefined;
}
