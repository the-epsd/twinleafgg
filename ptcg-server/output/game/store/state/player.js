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
        this.retreatedTurn = 0;
        this.energyPlayedTurn = 0;
        this.stadiumPlayedTurn = 0;
        this.stadiumUsedTurn = 0;
        this.marker = new card_marker_1.Marker();
        this.attackMarker = new card_marker_1.Marker();
        this.abilityMarker = new card_marker_1.Marker();
        this.avatarName = '';
    }
    prompt(state, arg1) {
        throw new Error('Method not implemented.');
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
            this.active.clearEffects();
            this.active = this.bench[benchIndex];
            this.bench[benchIndex] = temp;
        }
    }
}
exports.Player = Player;
