import { GameError } from '../game-error';
import { GameMessage } from '../game-message';
import { CardTarget, PlayerType, SlotType } from './actions/play-card-action';
import { Card } from './card/card';
import { CardType } from './card/card-types';
import { PokemonCard } from './card/pokemon-card';
import { EnergyCard } from './card/energy-card';
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

    const needsProviding: CardType[] = [];

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

    // BEGIN HANDLING BLEND/UNIT ENERGIES
    const blendProvides: CardType[][] = [];
    const blendCards: EnergyMap[] = [];

    // Collect blend/unit energies and their possible provides
    energy.forEach((energyMap, index) => {
      const card = energyMap.card;
      if (card instanceof EnergyCard) {
        let blendTypes: CardType[] | undefined;
        switch (card.name) {
          case 'Blend Energy WLFM':
            blendTypes = [CardType.WATER, CardType.LIGHTNING, CardType.FIGHTING, CardType.METAL];
            break;
          case 'Blend Energy GRPD':
            blendTypes = [CardType.GRASS, CardType.FIRE, CardType.PSYCHIC, CardType.DARK];
            break;
          case 'Unit Energy GRW':
            blendTypes = [CardType.GRASS, CardType.FIRE, CardType.WATER];
            break;
          case 'Unit Energy LPM':
            blendTypes = [CardType.LIGHTNING, CardType.PSYCHIC, CardType.METAL];
            break;
          case 'Unit Energy FDY':
            blendTypes = [CardType.FIGHTING, CardType.DARK, CardType.FAIRY];
            break;
        }
        if (blendTypes) {
          blendProvides.push(blendTypes);
          blendCards.push(energyMap);
        }
      }
    });

    // For each needed energy type, try to match it with a blend energy
    const matchedBlends = new Set<number>();
    for (let i = 0; i < needsProviding.length; i++) {
      const neededType = needsProviding[i];
      for (let j = 0; j < blendProvides.length; j++) {
        if (!matchedBlends.has(j) && blendProvides[j].includes(neededType)) {
          // Found a match - remove this blend energy from provides
          const index = provides.findIndex(energy => energy === blendCards[j].provides[0]);
          if (index !== -1) {
            provides.splice(index, 1);
          }
          matchedBlends.add(j);
          rainbow--;
          needsProviding.splice(i, 1);
          i--; // Adjust index since we removed an element
          break;
        }
      }
    }
    // END HANDLING BLEND/UNIT ENERGIES

    // Check if we have enough rainbow energies for remaining needs
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