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

/** One energy unit: either a concrete type, or a choosable set of types (blend/unit). */
type EnergyUnit =
  | { kind: 'concrete'; type: CardType }
  | { kind: 'choosable'; types: CardType[] };

export class StateUtils {
  static getStadium(state: State) {
    throw new Error('Method not implemented.');
  }

  /**
   * True when provides lists multiple distinct types — one energy choosable as any of them.
   * Homogeneous repeats ([D,D], [C,C], [ANY,ANY]) are multi-unit, not choosable.
   */
  public static isChoosableProvides(provides: CardType[]): boolean {
    return new Set(provides).size > 1;
  }

  /** Number of energy units an EnergyMap provides entry represents. */
  public static getProvidesUnitCount(provides: CardType[]): number {
    return StateUtils.isChoosableProvides(provides) ? 1 : provides.length;
  }

  /** Whether this provides array can satisfy the given energy type (including ANY). */
  public static providesMatchesType(provides: CardType[], type: CardType): boolean {
    if (provides.includes(CardType.ANY)) {
      return true;
    }
    return provides.includes(type);
  }

  private static toEnergyUnits(energy: EnergyMap[]): EnergyUnit[] {
    const units: EnergyUnit[] = [];
    for (const e of energy) {
      if (StateUtils.isChoosableProvides(e.provides)) {
        units.push({ kind: 'choosable', types: [...e.provides] });
      } else {
        for (const t of e.provides) {
          units.push({ kind: 'concrete', type: t });
        }
      }
    }
    return units;
  }

  public static checkEnoughEnergy(energy: EnergyMap[], cost: CardType[]): boolean {
    if (cost.length === 0) {
      return true;
    }

    const units = StateUtils.toEnergyUnits(energy);
    let colorless = 0;
    const needsProviding: CardType[] = [];

    cost.forEach(costType => {
      switch (costType) {
        case CardType.ANY:
        case CardType.NONE:
          break;
        case CardType.COLORLESS:
          colorless += 1;
          break;
        default: {
          const index = units.findIndex(
            u => u.kind === 'concrete' && u.type === costType
          );
          if (index !== -1) {
            units.splice(index, 1);
          } else {
            needsProviding.push(costType);
          }
        }
      }
    });

    // Match remaining typed costs with choosable (blend/unit) energies
    for (let i = 0; i < needsProviding.length; i++) {
      const neededType = needsProviding[i];
      const index = units.findIndex(
        u => u.kind === 'choosable' && u.types.includes(neededType)
      );
      if (index !== -1) {
        units.splice(index, 1);
        needsProviding.splice(i, 1);
        i--;
      }
    }

    // Remaining typed costs need CardType.ANY
    for (const _ of needsProviding) {
      const index = units.findIndex(
        u => u.kind === 'concrete' && u.type === CardType.ANY
      );
      if (index !== -1) {
        units.splice(index, 1);
      } else {
        return false;
      }
    }

    // Leftover units (concrete or unused choosable) pay colorless
    return units.length >= colorless;
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

  /**
   * Returns true when every energy entry has the same provides array.
   * Used to skip the energy selection prompt when all options are interchangeable.
   */
  public static allEnergyProvidesIdentical(energyMap: EnergyMap[]): boolean {
    if (energyMap.length === 0) {
      return false;
    }
    const providesKey = (e: EnergyMap) => [...e.provides].sort().join(',');
    const firstKey = providesKey(energyMap[0]);
    return energyMap.every(e => providesKey(e) === firstKey);
  }

  /**
   * Apply one EnergyMap entry against remaining typed costs.
   * Choosable provides pay at most one typed cost; homogeneous entries pay one per matching unit.
   */
  private static applyProvidesToTypedCosts(provides: CardType[], costs: CardType[]): void {
    if (StateUtils.isChoosableProvides(provides)) {
      const matchIndex = costs.findIndex(c => StateUtils.providesMatchesType(provides, c));
      if (matchIndex !== -1) {
        costs.splice(matchIndex, 1);
      }
      return;
    }

    for (const c of provides) {
      if (c === CardType.ANY && costs.length > 0) {
        costs.shift();
      } else {
        const i = costs.indexOf(c);
        if (i !== -1) {
          costs.splice(i, 1);
        }
      }
    }
  }

  /**
   * Returns a minimal set of EnergyMap entries that satisfies the cost, or null if impossible.
   * Satisfies typed costs first, then colorless, then trims excess.
   */
  public static selectMinimalEnergyForCost(energyMap: EnergyMap[], cost: CardType[]): EnergyMap[] | null {
    if (cost.length === 0) {
      return [];
    }
    let result: EnergyMap[] = [];
    const provides = energyMap.slice();
    const costs = cost.filter(c => c !== CardType.COLORLESS);

    // Satisfy typed costs first
    while (costs.length > 0 && provides.length > 0) {
      const costType = costs[0];
      let index = provides.findIndex(p => StateUtils.providesMatchesType(p.provides, costType));
      if (index === -1) {
        index = provides.findIndex(p => p.provides.includes(CardType.ANY));
      }
      if (index === -1) {
        return null;
      }
      const provide = provides[index];
      provides.splice(index, 1);
      result.push(provide);
      StateUtils.applyProvidesToTypedCosts(provide.provides, costs);
    }

    if (costs.length > 0) {
      return null;
    }

    // Satisfy colorless with remaining provides (prefer fewer units)
    provides.sort((p1, p2) => {
      return StateUtils.getProvidesUnitCount(p1.provides) - StateUtils.getProvidesUnitCount(p2.provides);
    });
    while (provides.length > 0 && !StateUtils.checkEnoughEnergy(result, cost)) {
      const provide = provides.shift();
      if (provide) {
        result.push(provide);
      }
    }

    if (!StateUtils.checkEnoughEnergy(result, cost)) {
      return null;
    }

    // Trim to minimal
    let needCheck = true;
    while (needCheck) {
      needCheck = false;
      for (let i = 0; i < result.length; i++) {
        const tempCards = result.slice();
        tempCards.splice(i, 1);
        if (StateUtils.checkEnoughEnergy(tempCards, cost)) {
          result = tempCards;
          needCheck = true;
          break;
        }
      }
    }

    return result;
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

  public static findPokemonSlot(state: State, card: Card): PokemonCardList | undefined {
    const cardLists: { pokemonSlot: PokemonCardList, cardList: CardList | Card[] }[] = [];
    for (const player of state.players) {
      cardLists.push({ pokemonSlot: player.active, cardList: player.active.cards });
      cardLists.push({ pokemonSlot: player.active, cardList: player.active.energies });
      cardLists.push({ pokemonSlot: player.active, cardList: player.active.tools });
      player.bench.forEach(item => cardLists.push(
        { pokemonSlot: item, cardList: item.cards },
        { pokemonSlot: item, cardList: item.energies },
        { pokemonSlot: item, cardList: item.tools }
      ));
    }
    const cardList = cardLists.find(c => Array.isArray(c.cardList) ? c.cardList.includes(card) : c.cardList.cards.includes(card));
    return cardList ? cardList.pokemonSlot : undefined;
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