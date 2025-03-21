import { GameError } from '../game-error';
import { GameMessage } from '../game-message';
import { CardTarget, PlayerType, SlotType } from './actions/play-card-action';
import { Card } from './card/card';
import { CardType } from './card/card-types';
import { PokemonCard } from './card/pokemon-card';
import { EnergyMap } from './prompts/choose-energy-prompt';
import { CardList } from './state/card-list';
import { Player } from './state/player';
import { PokemonCardList } from './state/pokemon-card-list';
import { State } from './state/state';

export class StateUtils {
  static getStadium(state: State) {
    throw new Error('Method not implemented.');
  }
  public static checkEnoughEnergy(energy: EnergyMap[], cost: CardType[]): boolean {
    if (cost.length === 0) {
      return true;
    }

    // Group energies by card to handle multi-energy cards correctly
    const cardEnergies: Map<Card, CardType[]> = new Map();
    energy.forEach(e => {
      cardEnergies.set(e.card, e.provides);
    });

    // Create a working copy of the cost
    const remainingCost = [...cost];

    // Count colorless energy required
    let colorlessCount = 0;
    for (let i = remainingCost.length - 1; i >= 0; i--) {
      if (remainingCost[i] === CardType.COLORLESS) {
        colorlessCount++;
        remainingCost.splice(i, 1);
      } else if (remainingCost[i] === CardType.ANY || remainingCost[i] === CardType.NONE) {
        remainingCost.splice(i, 1);
      }
    }

    // First match specific energy types with cards that provide only that type
    for (let i = remainingCost.length - 1; i >= 0; i--) {
      const costType = remainingCost[i];

      // Look for single-energy cards first
      let found = false;
      for (const [card, provides] of cardEnergies.entries()) {
        if (provides.length === 1 && provides[0] === costType) {
          cardEnergies.delete(card);
          found = true;
          break;
        }
      }

      if (found) {
        remainingCost.splice(i, 1);
      }
    }

    // Now handle multi-energy cards
    // Sort the remaining costs by rarity
    remainingCost.sort();

    for (let i = 0; i < remainingCost.length; i++) {
      const costType = remainingCost[i];
      let satisfied = false;

      // Look for a multi-energy card that can provide this type
      for (const [card, provides] of cardEnergies.entries()) {
        if (provides.includes(costType)) {
          cardEnergies.delete(card);
          satisfied = true;
          break;
        }
      }

      if (!satisfied) {
        // Check for rainbow energy (ANY)
        for (const [card, provides] of cardEnergies.entries()) {
          if (provides.includes(CardType.ANY)) {
            cardEnergies.delete(card);
            satisfied = true;
            break;
          }
        }

        if (!satisfied) {
          return false; // Not enough energy
        }
      }
    }

    // Count remaining available energy for colorless
    let availableForColorless = 0;
    for (const _ of cardEnergies) {
      // Each remaining card contributes only 1 energy for colorless
      availableForColorless++;
    }

    return availableForColorless >= colorlessCount;
  }

  static getCombinations(arr: CardType[][], n: number): CardType[][] {
    let i, j, k, l = arr.length, childperm, ret = [];
    let elem: CardType[] = [];
    if (n == 1) {
      for (i = 0; i < arr.length; i++) {
        for (j = 0; j < arr[i].length; j++) {
          ret.push([arr[i][j]]);
        }
      }
      return ret;
    }
    else {
      for (i = 0; i < l; i++) {
        elem = arr.shift()!;
        for (j = 0; j < elem.length; j++) {
          childperm = this.getCombinations(arr.slice(), n - 1);
          for (k = 0; k < childperm.length; k++) {
            ret.push([elem[j]].concat(childperm[k]));
          }
        }
      }
      return ret;
    }
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

  public static isPokemonInPlay(player: Player, pokemon: PokemonCard, location?: SlotType.BENCH | SlotType.ACTIVE): boolean {
    let inPlay = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      if (card === pokemon) {
        if ((location === SlotType.BENCH && cardList === player.active) ||
          (location === SlotType.ACTIVE && cardList !== player.active)) {
          inPlay = false;
        } else {
          inPlay = true;
        }
      }
    });
    return inPlay;
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