import { Card } from './card/card';
import { CardList } from './state/card-list';
import { CardTarget } from './actions/play-card-action';
import { CardType } from './card/card-types';
import { State } from './state/state';
import { Player } from './state/player';
import { PokemonCardList } from './state/pokemon-card-list';
import { EnergyMap } from './prompts/choose-energy-prompt';
export declare class StateUtils {
  static checkEnoughEnergy(energy: EnergyMap[], cost: CardType[]): boolean;
  static checkExactEnergy(energy: EnergyMap[], cost: CardType[]): boolean;
  static getOpponent(state: State, player: Player): Player;
  static getTarget(state: State, player: Player, target: CardTarget): PokemonCardList;
  static findCardList(state: State, card: Card): CardList;
  static findOwner(state: State, cardList: CardList): Player;
  static getStadiumCard(state: State): Card | undefined;
}
