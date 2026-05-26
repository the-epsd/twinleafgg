import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { PlayerType, SlotType } from '../actions/play-card-action';
import { CardTag } from '../card/card-types';
import { MovedToActiveEffect } from '../effects/game-effects';
import { CardList } from './card-list';
import { Marker } from './card-marker';
import { PokemonCardList } from './pokemon-card-list';
export class Player {
    constructor() {
        this.id = 0;
        this.name = '';
        this.deck = new CardList();
        this.hand = new CardList();
        this.discard = new CardList();
        this.lostzone = new CardList();
        this.stadium = new CardList();
        this.supporter = new CardList();
        this.active = new PokemonCardList();
        this.bench = [];
        this.prizes = [];
        this.supporterTurn = 0;
        this.ancientSupporter = false;
        this.rocketSupporter = false;
        this.retreatedTurn = 0;
        this.energyPlayedTurn = 0;
        this.stadiumPlayedTurn = 0;
        this.stadiumUsedTurn = 0;
        this.marker = new Marker();
        this.usedVSTAR = false;
        this.usedGX = false;
        this.assembledVUNIONs = [];
        this.showAllStageAbilities = false;
        this.legacyEnergyUsed = false;
        this.DAMAGE_DEALT_MARKER = 'DAMAGE_DEALT_MARKER';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
        this.CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';
        this.KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
        this.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER = 'OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
        this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
        this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
        this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
        this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';
        this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER';
        this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER';
        this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER';
        this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER';
        this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = 'PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
        this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = 'CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
        this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES = 'PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES';
        this.PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = 'PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER';
        this.CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = 'CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER';
        this.ATTACK_EFFECT_SUPPORTER_LOCK = 'ATTACK_EFFECT_SUPPORTER_LOCK';
        this.ATTACK_EFFECT_ITEM_LOCK = 'ATTACK_EFFECT_ITEM_LOCK';
        this.ATTACK_EFFECT_TOOL_LOCK = 'ATTACK_EFFECT_TOOL_LOCK';
        this.ATTACK_EFFECT_STADIUM_LOCK = 'ATTACK_EFFECT_STADIUM_LOCK';
        this.ATTACK_EFFECT_SPECIAL_ENERGY_LOCK = 'ATTACK_EFFECT_SPECIAL_ENERGY_LOCK';
        this.UNRELENTING_ONSLAUGHT_MARKER = 'UNRELENTING_ONSLAUGHT_MARKER';
        this.UNRELENTING_ONSLAUGHT_2_MARKER = 'UNRELENTING_ONSLAUGHT_2_MARKER';
        // Track Pokemon cards that moved from Bench to Active this turn
        this.movedToActiveThisTurn = [];
        this.usedDragonsWish = false;
        this.pecharuntexIsInPlay = false;
        this.usedFanCall = false;
        this.canEvolve = false;
        this.supportersForDetour = new CardList();
        //GX-Attack Dedicated Section
        this.usedAlteredCreation = false;
        this.alteredCreationDamage = false;
        this.usedFullMetalWall = false;
        // Taken prize cards ("taken" means "moved to the player's hand")
        this.prizesTaken = 0;
        this.prizesTakenThisTurn = 0;
        this.prizesTakenLastTurn = 0;
        // Track which card IDs in hand are playable (stored as array for serialization)
        this.playableCardIds = [];
        // Game statistics tracking
        this.gameStats = {
            prizesTakenCount: 0,
            totalDamageDealt: 0,
            pokemonDamageStats: {},
            topPokemon: null
        };
    }
    // Alias for newer naming; the underlying serialized field remains "supporter".
    get playZone() {
        return this.supporter;
    }
    getPrizeLeft() {
        return this.prizes.reduce((left, p) => left + p.cards.length, 0);
    }
    forEachPokemon(player, handler) {
        let pokemonCard = this.active.getPokemonCard();
        let target;
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
    removeAttackEffects() {
        this.marker.removeAttackEffects();
    }
    removePokemonEffects(target) {
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
    getPokemonInPlay() {
        const list = [];
        this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
            if (cardList.cards.length !== 0)
                list.push(cardList);
        });
        return list;
    }
    vPokemon() {
        let result = false;
        this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
            if (cardList.vPokemon()) {
                result = true;
            }
        });
        return result;
    }
    singleStrike() {
        let result = false;
        this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
            if (cardList.getPokemons().some(pokemon => pokemon.tags.includes(CardTag.SINGLE_STRIKE))) {
                result = true;
            }
        });
        return result;
    }
    fusionStrike() {
        let result = false;
        this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
            if (cardList.getPokemons().some(pokemon => pokemon.tags.includes(CardTag.FUSION_STRIKE))) {
                result = true;
            }
        });
        return result;
    }
    rapidStrike() {
        let result = false;
        this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
            if (cardList.getPokemons().some(pokemon => pokemon.tags.includes(CardTag.RAPID_STRIKE))) {
                result = true;
            }
        });
        return result;
    }
    getSlot(slotType) {
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
    switchPokemon(target, store, state) {
        const benchIndex = this.bench.indexOf(target);
        if (benchIndex !== -1) {
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
        }
    }
}
