import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { CardTarget, PlayerType, SlotType } from '../actions/play-card-action';
import { CardTag } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { CardList } from './card-list';
import { Marker } from './card-marker';
import { PokemonCardList } from './pokemon-card-list';
import { GameStats } from './game-stats-interfaces';
export class Player {

  id: number = 0;

  name: string = '';

  deckId?: number;

  sleeveImagePath?: string;

  deck: CardList = new CardList();

  hand: CardList = new CardList();

  discard: CardList = new CardList();

  lostzone: CardList = new CardList();

  stadium: CardList = new CardList();

  supporter: CardList = new CardList();

  active: PokemonCardList = new PokemonCardList();

  bench: PokemonCardList[] = [];

  prizes: CardList[] = [];

  supporterTurn: number = 0;

  ancientSupporter: boolean = false;

  rocketSupporter: boolean = false;

  retreatedTurn: number = 0;

  energyPlayedTurn: number = 0;

  stadiumPlayedTurn: number = 0;

  stadiumUsedTurn: number = 0;

  marker = new Marker();

  avatarName: string = '';

  usedVSTAR: boolean = false;

  usedGX: boolean = false;

  assembledVUNIONs: string[] = [];

  showAllStageAbilities: boolean = false;

  legacyEnergyUsed: boolean = false;

  public readonly DAMAGE_DEALT_MARKER = 'DAMAGE_DEALT_MARKER';
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
  public readonly CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';
  public readonly KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
  public readonly OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER = 'OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER';
  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
  public readonly PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
  public readonly DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
  public readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
  public readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';
  public readonly DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER';
  public readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER';
  public readonly DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER';
  public readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER';
  public readonly PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: string = 'PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
  public readonly CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: string = 'CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
  public readonly PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES = 'PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES';
  public readonly PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = 'PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER';
  public readonly CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = 'CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER';
  public readonly ATTACK_EFFECT_SUPPORTER_LOCK = 'ATTACK_EFFECT_SUPPORTER_LOCK';
  public readonly ATTACK_EFFECT_ITEM_LOCK = 'ATTACK_EFFECT_ITEM_LOCK';
  public readonly ATTACK_EFFECT_TOOL_LOCK = 'ATTACK_EFFECT_TOOL_LOCK';
  public readonly ATTACK_EFFECT_STADIUM_LOCK = 'ATTACK_EFFECT_STADIUM_LOCK';
  public readonly ATTACK_EFFECT_SPECIAL_ENERGY_LOCK = 'ATTACK_EFFECT_SPECIAL_ENERGY_LOCK';

  public readonly UNRELENTING_ONSLAUGHT_MARKER = 'UNRELENTING_ONSLAUGHT_MARKER';
  public readonly UNRELENTING_ONSLAUGHT_2_MARKER = 'UNRELENTING_ONSLAUGHT_2_MARKER';

  // Track Pokemon cards that moved from Bench to Active this turn
  public movedToActiveThisTurn: number[] = [];

  usedRapidStrikeSearchThisTurn: any;
  usedExcitingStageThisTurn: any;
  usedSquawkAndSeizeThisTurn: any;
  usedTurnSkip: any;
  usedTableTurner: any;
  usedMinusCharge: any;
  usedPlusCharge: any;
  usedLunarCycle: any;
  usedRunErrand: any;
  usedTributeDance: any;
  chainsOfControlUsed: any;
  usedDragonsWish = false;
  pecharuntexIsInPlay = false;
  usedFanCall = false;
  canEvolve = false;
  supportersForDetour = new CardList();

  //GX-Attack Dedicated Section
  public usedAlteredCreation: boolean = false;
  public alteredCreationDamage: boolean = false;
  public usedFullMetalWall: boolean = false;

  // Taken prize cards ("taken" means "moved to the player's hand")
  prizesTaken: number = 0;
  prizesTakenThisTurn: number = 0;
  prizesTakenLastTurn: number = 0;

  // Track which card IDs in hand are playable (stored as array for serialization)
  playableCardIds: number[] = [];

  // Game statistics tracking
  gameStats: GameStats = {
    prizesTakenCount: 0,
    totalDamageDealt: 0,
    pokemonDamageStats: {},
    topPokemon: null
  };

  getPrizeLeft(): number {
    return this.prizes.reduce((left, p) => left + p.cards.length, 0);
  }

  forEachPokemon(
    player: PlayerType,
    handler: (cardList: PokemonCardList, pokemonCard: PokemonCard, target: CardTarget) => void
  ): void {
    let pokemonCard = this.active.getPokemonCard();
    let target: CardTarget;

    if (pokemonCard !== undefined) {
      target = { player, slot: SlotType.ACTIVE, index: 0 };
      handler(this.active, pokemonCard, target);
    }

    for (let i = 0; i < this.bench.length; i++) {
      pokemonCard = this.bench[i].getPokemonCard();
      if (pokemonCard !== undefined) {
        target = { player, slot: SlotType.BENCH, index: i };
        handler(this.bench[i], pokemonCard, target);
      }
    }
  }

  /**
   * Remove all attack-sourced markers from the player level.
   * Preserves ability markers, trainer markers, and other non-attack state.
   */
  removeAttackEffects(): void {
    this.marker.removeAttackEffects();
  }

  removePokemonEffects(target: PokemonCardList) {

    //breakdown of markers to be removed
    this.marker.removeMarker(this.ATTACK_USED_MARKER);
    this.marker.removeMarker(this.ATTACK_USED_2_MARKER);
    this.marker.removeMarker(this.KNOCKOUT_MARKER);
    this.marker.removeMarker(this.CLEAR_KNOCKOUT_MARKER);
    this.marker.removeMarker(this.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER);
    this.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER);
    this.marker.removeMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER);
    this.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER);
    this.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER);
    this.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
    this.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
    this.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER);
    this.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
    this.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
    this.marker.removeMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
    this.marker.removeMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
    this.marker.removeMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES);
    this.marker.removeMarker(this.PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER);
    this.marker.removeMarker(this.CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER);
    target.clearEffects();
  }

  getPokemonInPlay(): PokemonCardList[] {
    const list: PokemonCardList[] = [];
    this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
      if (cardList.cards.length !== 0)
        list.push(cardList);
    });
    return list;
  }

  vPokemon(): boolean {
    let result = false;
    this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
      if (cardList.vPokemon()) {
        result = true;
      }
    });
    return result;
  }

  singleStrike(): boolean {
    let result = false;
    this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
      if (cardList.getPokemons().some(pokemon => pokemon.tags.includes(CardTag.SINGLE_STRIKE))) {
        result = true;
      }
    });
    return result;
  }

  fusionStrike(): boolean {
    let result = false;
    this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
      if (cardList.getPokemons().some(pokemon => pokemon.tags.includes(CardTag.FUSION_STRIKE))) {
        result = true;
      }
    });
    return result;
  }

  rapidStrike(): boolean {
    let result = false;
    this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
      if (cardList.getPokemons().some(pokemon => pokemon.tags.includes(CardTag.RAPID_STRIKE))) {
        result = true;
      }
    });
    return result;
  }

  getSlot(slotType: SlotType): CardList {
    switch (slotType) {
      case SlotType.DISCARD:
        return this.discard;
      case SlotType.HAND:
        return this.hand;
      case SlotType.LOSTZONE:
        return this.lostzone;
      case SlotType.DECK:
        return this.deck;
      default:
        throw new GameError(GameMessage.INVALID_TARGET);
    }
  }

  switchPokemon(target: PokemonCardList, store?: any, state?: any) {
    const benchIndex = this.bench.indexOf(target);
    if (benchIndex !== -1) {
      const temp = this.active;

      // Remove player-level markers scoped to the active Pokemon.
      // Uses both targetScope metadata (migrated) and whitelist (unmigrated).
      // Does NOT remove player-scoped locks (item lock, tool lock, etc.).
      this.marker.removePokemonScopedMarkers();

      // Remove attack effects from the Pokemon leaving active
      this.active.removeAttackEffects();

      this.active = this.bench[benchIndex];
      this.bench[benchIndex] = temp;

      const activePokemon = this.active.getPokemonCard();
      if (activePokemon) {
        // Add to new tracking system
        if (!this.movedToActiveThisTurn.includes(activePokemon.id)) {
          this.movedToActiveThisTurn.push(activePokemon.id);
        }

        // Keep existing boolean for backwards compatibility
        activePokemon.movedToActiveThisTurn = true;
      }
    }
  }
}