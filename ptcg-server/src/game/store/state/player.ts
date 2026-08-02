import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { CardTarget, PlayerType, SlotType } from '../actions/play-card-action';
import { CardTag } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { MovedFromActiveToBenchEffect, MovedToActiveEffect } from '../effects/game-effects';
import { CardList } from './card-list';
import { Marker } from './card-marker';
import { PokemonCardList } from './pokemon-card-list';
import { GameStats } from './game-stats-interfaces';
import { PendingEndOfTurnEffect } from './pending-end-of-turn-effects';
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

  // Alias for newer naming; the underlying serialized field remains "supporter".
  get playZone(): CardList {
    return this.supporter;
  }

  active: PokemonCardList = new PokemonCardList();

  bench: PokemonCardList[] = [];

  prizes: CardList[] = [];

  supporterTurn: number = 0;

  ancientSupporter: boolean = false;

  rocketSupporter: boolean = false;

  playedJanine: boolean = false;

  playedKogasTrap: boolean = false;

  playedCanari: boolean = false;

  retreatedTurn: number = 0;

  energyPlayedTurn: number = 0;

  stadiumPlayedTurn: number = 0;

  stadiumUsedTurn: number = 0;

  marker = new Marker();

  pendingEndOfTurnEffects: PendingEndOfTurnEffect[] = [];

  avatarName: string = '';

  usedVSTAR: boolean = false;

  usedGX: boolean = false;

  assembledVUNIONs: string[] = [];

  showAllStageAbilities: boolean = false;

  legacyEnergyUsed: boolean = false;

  public readonly DAMAGE_DEALT_MARKER = 'DAMAGE_DEALT_MARKER';
  public readonly CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';
  public readonly KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
  /**
   * Attack-sourced hand play locks (Item / Supporter / Stadium / Tool / Special Energy).
   * Live on the player — not cleared by Pokemon switch. Cleared after
   * {@link playLocksTurnsRemaining} of this player's EndTurns (default 1 =
   * "during opponent's next turn").
   */
  public cannotPlayItemCards = false;
  public cannotPlaySupporterCards = false;
  public cannotPlayStadiumCards = false;
  public cannotPlayToolCards = false;
  public cannotPlaySpecialEnergyCards = false;
  public cannotPlayPokemonWithAbilities = false;
  public playLocksTurnsRemaining = 0;
  public ancientPokemonAttackedLastTurn = false;

  /** Apply attack-sourced play locks for this player's upcoming turn(s). */
  public applyPlayLocks(locks: {
    item?: boolean;
    supporter?: boolean;
    stadium?: boolean;
    tool?: boolean;
    specialEnergy?: boolean;
    pokemonWithAbilities?: boolean;
  }, turnsRemaining: number = 1): void {
    if (locks.item) {
      this.cannotPlayItemCards = true;
    }
    if (locks.supporter) {
      this.cannotPlaySupporterCards = true;
    }
    if (locks.stadium) {
      this.cannotPlayStadiumCards = true;
    }
    if (locks.tool) {
      this.cannotPlayToolCards = true;
    }
    if (locks.specialEnergy) {
      this.cannotPlaySpecialEnergyCards = true;
    }
    if (locks.pokemonWithAbilities) {
      this.cannotPlayPokemonWithAbilities = true;
    }
    this.playLocksTurnsRemaining = Math.max(this.playLocksTurnsRemaining, Math.max(1, turnsRemaining));
  }

  public clearPlayLocks(): void {
    this.cannotPlayItemCards = false;
    this.cannotPlaySupporterCards = false;
    this.cannotPlayStadiumCards = false;
    this.cannotPlayToolCards = false;
    this.cannotPlaySpecialEnergyCards = false;
    this.cannotPlayPokemonWithAbilities = false;
    this.playLocksTurnsRemaining = 0;
  }

  /** Decrement play-lock duration; clear flags when the countdown hits 0. */
  public tickPlayLocksAtEndOfTurn(): void {
    if (this.playLocksTurnsRemaining <= 0) {
      return;
    }
    this.playLocksTurnsRemaining -= 1;
    if (this.playLocksTurnsRemaining <= 0) {
      this.clearPlayLocks();
    }
  }

  // Track Pokemon cards that moved from Bench to Active this turn
  public movedToActiveThisTurn: number[] = [];

  // Track Pokemon cards that moved from Active to Bench this turn
  public movedFromActiveToBenchThisTurn: number[] = [];

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
  pokemonKnockedOutDuringOpponentsLastTurn = false;
  pokemonKnockedOutByAttackDuringOpponentsLastTurn = false;
  pokemonKnockedOutLastTurnEntries: CardTag[][] = [];
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

  /**
   * Subset of hand cards whose useFromHandToBench ability is currently legal
   * (Excitedive, Swelling Flash, …). Distinct from {@link playableCardIds} so
   * evolution can remain playable when a hand ability lock is active.
   */
  playableHandAbilityCardIds: number[] = [];

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
    this.marker.removeMarker(this.KNOCKOUT_MARKER);
    this.marker.removeMarker(this.CLEAR_KNOCKOUT_MARKER);
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
      const benchedOutCard = this.active.getPokemonCard();
      const temp = this.active;

      // Remove player-level markers scoped to the active Pokemon.
      // Uses both targetScope metadata (migrated) and whitelist (unmigrated).
      // Does NOT remove player-scoped locks (item lock, tool lock, etc.).
      this.marker.removePokemonScopedMarkers();

      // Remove attack effects from the Pokemon leaving active
      this.active.removeAttackEffects();

      // remove all special conditions
      this.active.specialConditions = [];

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

        // Dispatch MovedToActiveEffect for cards that intercept it (e.g. Cobalion-EX Metal Road)
        if (store && state) {
          store.reduceEffect(state, new MovedToActiveEffect(this, activePokemon));
        }
      }

      if (benchedOutCard) {
        if (!this.movedFromActiveToBenchThisTurn.includes(benchedOutCard.id)) {
          this.movedFromActiveToBenchThisTurn.push(benchedOutCard.id);
        }

        if (store && state) {
          store.reduceEffect(state, new MovedFromActiveToBenchEffect(this, benchedOutCard));
        }
      }
    }
  }
}
