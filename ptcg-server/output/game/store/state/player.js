"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const card_list_1 = require("./card-list");
const play_card_action_1 = require("../actions/play-card-action");
const pokemon_card_list_1 = require("./pokemon-card-list");
const card_marker_1 = require("./card-marker");
class Player {
    constructor() {
        this.id = 0;
        this.name = '';
        this.deck = new card_list_1.CardList();
        this.hand = new card_list_1.CardList();
        this.discard = new card_list_1.CardList();
        this.lostzone = new card_list_1.CardList();
        this.stadium = new card_list_1.CardList();
        this.supporter = new card_list_1.CardList();
        this.active = new pokemon_card_list_1.PokemonCardList();
        this.bench = [];
        this.prizes = [];
        this.supporterTurn = 0;
        this.retreatedTurn = 0;
        this.energyPlayedTurn = 0;
        this.stadiumPlayedTurn = 0;
        this.stadiumUsedTurn = 0;
        this.marker = new card_marker_1.Marker();
        this.attackMarker = new card_marker_1.Marker();
        this.abilityMarker = new card_marker_1.Marker();
        this.avatarName = '';
        this.usedVSTAR = false;
        this.usedGX = false;
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
        this.CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';
        this.KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
        this.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER = 'OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
        this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
        this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
        this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';
    }
    getPrizeLeft() {
        return this.prizes.reduce((left, p) => left + p.cards.length, 0);
    }
    forEachPokemon(player, handler) {
        let pokemonCard = this.active.getPokemonCard();
        let target;
        if (pokemonCard !== undefined) {
            target = { player, slot: play_card_action_1.SlotType.ACTIVE, index: 0 };
            handler(this.active, pokemonCard, target);
        }
        for (let i = 0; i < this.bench.length; i++) {
            pokemonCard = this.bench[i].getPokemonCard();
            if (pokemonCard !== undefined) {
                target = { player, slot: play_card_action_1.SlotType.BENCH, index: i };
                handler(this.bench[i], pokemonCard, target);
            }
        }
    }
    switchPokemon(target) {
        const benchIndex = this.bench.indexOf(target);
        if (benchIndex !== -1) {
            const temp = this.active;
            const tempCard = temp.getPokemonCard();
            //breakdown of markers to be removed on switchPokemon()
            this.marker.removeMarker(this.ATTACK_USED_MARKER);
            this.marker.removeMarker(this.ATTACK_USED_2_MARKER);
            this.marker.removeMarker(this.KNOCKOUT_MARKER);
            this.marker.removeMarker(this.CLEAR_KNOCKOUT_MARKER);
            this.marker.removeMarker(this.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER);
            this.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER);
            this.marker.removeMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER);
            this.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
            this.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER);
            this.active.clearEffects();
            this.active = this.bench[benchIndex];
            this.bench[benchIndex] = temp;
            tempCard.movedToActiveThisTurn = true;
        }
    }
}
exports.Player = Player;
