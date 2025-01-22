import { GameError } from '../game-error';
import { GameMessage } from '../game-message';
import { CardTarget, PlayerType, SlotType } from './actions/play-card-action';
import { Card } from './card/card';
import { CardType } from './card/card-types';
import { EnergyMap } from './prompts/choose-energy-prompt';
import { CardList } from './state/card-list';
import { Player } from './state/player';
import { PokemonCardList } from './state/pokemon-card-list';
import { State } from './state/state';

export class StateUtils {
  static getStadium(state: State) {
    throw new Error('Method not implemented.');
  }
  public static checkEnoughEnergy(energyMap: EnergyMap[], cost: CardType[]): boolean {
    // Step 1: Split the attack cost into hued energies (like Fire, Water) and colorless count
    // For example: cost of [F,W,C,C] becomes huesNeeded=[F,W] and colorlessNeeded=2
    const huesNeeded: CardType[] = [];
    let colorlessNeeded = 0;
    for (const c of cost) {
      if (c === CardType.COLORLESS) {
        colorlessNeeded++;
      } else if (c !== CardType.NONE && c !== CardType.ANY) {
        huesNeeded.push(c);
      }
    }

    // Step 2: Convert each Energy card's "provides" into its full set of possible types
    // For example: 
    // - A Basic Fire Energy's [F] stays as [F]
    // - Unit Energy LPM's [LPM] explodes to [L,P,M]
    // - Blend Energy WLFM's [WLFM] explodes to [W,L,F,M]
    const providedEnergySets: CardType[][] = energyMap.map(e => {
      const providedEnergySet: CardType[] = [];
      e.provides.forEach((type: CardType) => {
        switch (type) {
          case CardType.WLFM:
            providedEnergySet.push(CardType.WATER, CardType.LIGHTNING, CardType.FIGHTING, CardType.METAL);
            break;
          case CardType.GRPD:
            providedEnergySet.push(CardType.GRASS, CardType.FIRE, CardType.PSYCHIC, CardType.DARK);
            break;
          case CardType.LPM:
            providedEnergySet.push(CardType.LIGHTNING, CardType.PSYCHIC, CardType.METAL);
            break;
          case CardType.GRW:
            providedEnergySet.push(CardType.GRASS, CardType.FIRE, CardType.WATER);
            break;
          case CardType.FDY:
            providedEnergySet.push(CardType.FIGHTING, CardType.DARK, CardType.FAIRY);
            break;
          case CardType.ANY:
            providedEnergySet.push(CardType.ANY);
            break;
          default:
            providedEnergySet.push(type);
        }
      });
      return providedEnergySet;
    });

    // Step 3: Use backtracking to find a valid assignment of Energy cards to hued costs
    // For example: If we need [L,P] and have Unit LPM + Blend WLFM:
    // - Try assigning Unit LPM to L, then see if Blend WLFM can provide P
    // - If that fails, try Unit LPM for P and Blend WLFM for L
    // - If any combination works, return true
    if (!StateUtils.canFulfillCosts(providedEnergySets, huesNeeded)) {
      return false;
    }

    // Step 4: If we found a valid way to cover all hued costs,
    // ensure we have enough total Energy cards left to cover colorless
    // Simple check: Do we have at least (hued costs + colorless costs) total Energy cards?
    if (energyMap.length < (huesNeeded.length + colorlessNeeded)) {
      return false;
    }

    return true;
  }

  /**
   * Uses backtracking and recursion to find a valid assignment of Energy cards to hued costs
   * @param provided Array of what each Energy card can provide (e.g. [[L,P,M], [W,L,F,M]])
   * @param needed Array of required hued Energy (e.g. [L,P])
   * @returns boolean indicating whether a valid assignment was found
   */
  private static canFulfillCosts(provided: CardType[][], needed: CardType[]): boolean {
    // Base case: if no more hued needs, we've found a valid assignment
    if (needed.length === 0) {
      return true;
    }

    const required = needed[0];  // Take the first needed type/hue

    // Try each available Energy card to fulfill this need
    for (let i = 0; i < provided.length; i++) {
      const set = provided[i];
      // If this Energy can provide the needed type/hue
      if (set.includes(required) || set.includes(CardType.ANY)) {
        // Remove this Energy from available pool (since it can only be used once)
        const newSets = provided.slice();
        newSets.splice(i, 1);

        // Recursively try to fulfill the remaining needs with remaining energies
        const newNeeded = needed.slice(1);
        if (StateUtils.canFulfillCosts(newSets, newNeeded)) {
          return true;  // Found a valid assignment!
        }
        // If that didn't work, the loop continues to try the next Energy card
      }
    }
    // If we tried all energies and found no valid assignment, return false
    return false;
  }

  public static checkExactEnergy(energy: EnergyMap[], cost: CardType[]): boolean {
    let enough = StateUtils.checkEnoughEnergy(energy, cost);
    if (!enough) {
      return false;
    }

    for (let i = 0; i < energy.length; i++) {
      const tempCards = energy.slice();
      tempCards.splice(i, 1);
      enough = StateUtils.checkEnoughEnergy(tempCards, cost);
      if (enough) {
        return false;
      }
    }
    return true;
  }

  public static getPlayerById(state: State, playerId: number): Player {
    const player = state.players.find(p => p.id === playerId);
    if (player === undefined) {
      throw new GameError(GameMessage.INVALID_GAME_STATE);
    }
    return player;
  }

  public static getOpponent(state: State, player: Player): Player {
    const opponent = state.players.find(p => p.id !== player.id);
    if (opponent === undefined) {
      throw new GameError(GameMessage.INVALID_GAME_STATE);
    }
    return opponent;
  }

  public static getTarget(state: State, player: Player, target: CardTarget): PokemonCardList {
    if (target.player === PlayerType.TOP_PLAYER) {
      player = StateUtils.getOpponent(state, player);
    }
    if (target.slot === SlotType.ACTIVE) {
      return player.active;
    }
    if (target.slot !== SlotType.BENCH) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    if (player.bench[target.index] === undefined) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    return player.bench[target.index];
  }

  public static findCardList(state: State, card: Card): CardList {
    const cardLists: CardList[] = [];
    for (const player of state.players) {
      cardLists.push(player.active);
      cardLists.push(player.deck);
      cardLists.push(player.discard);
      cardLists.push(player.hand);
      cardLists.push(player.lostzone);
      cardLists.push(player.stadium);
      cardLists.push(player.supporter);
      player.bench.forEach(item => cardLists.push(item));
      player.prizes.forEach(item => cardLists.push(item));
    }
    const cardList = cardLists.find(c => c.cards.includes(card));
    if (cardList === undefined) {
      throw new GameError(GameMessage.INVALID_GAME_STATE);
    }
    return cardList;
  }

  public static findOwner(state: State, cardList: CardList): Player {
    for (const player of state.players) {
      const cardLists: CardList[] = [];
      cardLists.push(player.active);
      cardLists.push(player.deck);
      cardLists.push(player.discard);
      cardLists.push(player.hand);
      cardLists.push(player.lostzone);
      cardLists.push(player.stadium);
      cardLists.push(player.supporter);
      player.bench.forEach(item => cardLists.push(item));
      player.prizes.forEach(item => cardLists.push(item));
      if (cardLists.includes(cardList)) {
        return player;
      }
    }
    throw new GameError(GameMessage.INVALID_GAME_STATE);
  }

  public static getStadiumCard(state: State): Card | undefined {
    for (const player of state.players) {
      if (player.stadium.cards.length > 0) {
        return player.stadium.cards[0];
      }
    }
    return undefined;
  }
}