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
  public static checkEnoughEnergy(energy: EnergyMap[], cost: CardType[]): boolean {
    if (cost.length === 0) {
      return true;
    }

    const provides: CardType[] = [];
    energy.forEach(e => {
      e.provides.forEach(cardType => provides.push(cardType));
    });

    let colorless = 0;
    let rainbow = 0;

    let needsProviding: CardType[] = [];

    // First remove from array cards with specific energy types
    cost.forEach(costType => {
      switch (costType) {
        case CardType.ANY:
        case CardType.NONE:
          break;
        case CardType.COLORLESS:
          colorless += 1;
          break;
        default: {
          const index = provides.findIndex(energy => energy === costType);
          if (index !== -1) {
            provides.splice(index, 1);
          } else {
            needsProviding.push(costType);
            rainbow += 1;
          }
        }
      }
    });

    // BEGIN HANDLING BLEND ENERGIES
    const blendProvides: CardType[][] = [];

    // Check blend/unit energies
    provides.forEach((cardType, index) => {
      switch (cardType) {
        case CardType.LPM:
          blendProvides.push([CardType.LIGHTNING, CardType.PSYCHIC, CardType.METAL]);
          break;
        case CardType.GRW:
          blendProvides.push([CardType.GRASS, CardType.FIRE, CardType.WATER]);
          break;
        case CardType.FDY:
          blendProvides.push([CardType.FAIRY, CardType.DARK, CardType.FIGHTING]);
          break;
        case CardType.WLFM:
          blendProvides.push([CardType.WATER, CardType.LIGHTNING, CardType.FIGHTING, CardType.METAL]);
          break;
        case CardType.GRPD:
          blendProvides.push([CardType.GRASS, CardType.FIRE, CardType.PSYCHIC, CardType.DARK]);
          break;
        default:
          return;
      }
    });

    const possibleBlendPermutations = this.getCombinations(blendProvides, blendProvides.length);
    let needsProvidingPermutations: CardType[][] = [];

    if (needsProviding.length === 1) {
      needsProvidingPermutations.push(needsProviding);
    } else if (needsProviding.length > 1) {
      permutations(needsProviding, needsProviding.length);
    }

    // check needs providing from blendProvides
    // subtract 1 from rainbow when find is successful
    let needsProvidingMatchIndex = 0;
    let maxMatches = 0;

    possibleBlendPermutations.forEach((energyTypes, index) => {
      let matches = 0;
      for (let i = 0; i < needsProvidingPermutations.length; i++) {
        for (let j = 0; j < needsProvidingPermutations[i].length; j++) {
          if (energyTypes[j] === needsProvidingPermutations[i][j]) {
            matches++;
          }
        }

        if (matches > maxMatches) {
          maxMatches = matches;
          needsProvidingMatchIndex = i;
        }
      }
    });

    // remove blend matches from rainbow requirement
    rainbow -= maxMatches;

    // remove matched energy from provides
    for (let i = 0; i < maxMatches; i++) {
      const index = provides.findIndex(energy => energy === needsProvidingPermutations[needsProvidingMatchIndex][i]);
      provides.splice(index, 1);
    }
    // END HANDLING BLEND ENERGIES

    // Check if we have enough rainbow energies
    for (let i = 0; i < rainbow; i++) {
      const index = provides.findIndex(energy => energy === CardType.ANY);
      if (index !== -1) {
        provides.splice(index, 1);
      } else {
        return false;
      }
    }

    // Rest cards can be used to pay for colorless energies
    return provides.length >= colorless;


    // permutations calculation helper function
    function permutations(array: CardType[], currentSize: number) {
      if (currentSize == 1) { // recursion base-case (end)
        needsProvidingPermutations.push(array.join("").split("").map(x => parseInt(x)));
      }

      for (let i = 0; i < currentSize; i++) {
        permutations(array, currentSize - 1);
        if (currentSize % 2 == 1) {
          let temp = array[0];
          array[0] = array[currentSize - 1];
          array[currentSize - 1] = temp;
        } else {
          let temp = array[i];
          array[i] = array[currentSize - 1];
          array[currentSize - 1] = temp;
        }
      }
    }
  }

  static getCombinations(arr: CardType[][], n: number): CardType[][] {
    var i, j, k, l = arr.length, childperm, ret = [];
    var elem: CardType[] = [];
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

  public static getStadiumCard(state: State): Card | undefined {
    for (const player of state.players) {
      if (player.stadium.cards.length > 0) {
        return player.stadium.cards[0];
      }
    }
    return undefined;
  }

}
