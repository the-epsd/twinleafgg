"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EternatusVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class EternatusVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Eternatus V';
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.cardType = D;
        this.hp = 340;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.powers = [
            {
                name: 'Eternal Zone',
                powerType: game_1.PowerType.ABILITY,
                text: 'If all of your Pokémon in play are [D] type, you can have up to 8 Pokémon on your Bench, and you can\'t put non-[D] Pokémon into play. (If this Ability stops working, discard Pokémon from your Bench until you have 5.)'
            }
        ];
        this.attacks = [{
                name: 'Dread End',
                cost: [D, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each of your [D] Pokémon in play.'
            }];
        this.set = 'DAA';
        this.name = 'Eternatus VMAX';
        this.fullName = 'Eternatus VMAX DAA';
        this.setNumber = '117';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.ETERNATUS_EXPANDED_BENCH = 'ETERNATUS_EXPANDED_BENCH';
    }
    reduceEffect(store, state, effect) {
        // Eternal Zone
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            effect.benchSizes = state.players.map((player, index) => {
                var _a, _b;
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_c) {
                    if (!player.marker.hasMarker(this.ETERNATUS_EXPANDED_BENCH, this)) {
                        player.marker.removeMarker(this.ETERNATUS_EXPANDED_BENCH, this);
                    }
                    return 5;
                }
                // checking if eternatus is in play for the player in question
                let isEternInPlay = false;
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                    const pokemon = cardList.getPokemonCard();
                    if (!!pokemon && pokemon.name === 'Eternatus VMAX' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
                        isEternInPlay = true;
                    }
                });
                // if eternatus isn't in play, just skip everything effectively
                if (!isEternInPlay) {
                    if (!player.marker.hasMarker(this.ETERNATUS_EXPANDED_BENCH, this)) {
                        player.marker.removeMarker(this.ETERNATUS_EXPANDED_BENCH, this);
                    }
                    return 5;
                }
                // checking each pokemon for dark typing
                let darkPokemon = 0;
                let pokemonInPlay = 1;
                if (((_b = (_a = player.active) === null || _a === void 0 ? void 0 : _a.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.cardType) === D) {
                    darkPokemon++;
                }
                player.bench.forEach(benchSpot => {
                    var _a;
                    if (benchSpot.cards.length > 0) {
                        pokemonInPlay++;
                        if (((_a = benchSpot.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) === D) {
                            darkPokemon++;
                        }
                    }
                });
                // if all pokemon in play are dark types
                if (darkPokemon === pokemonInPlay) {
                    // slaps on a marker to check played pokemon for dark typing later
                    if (!player.marker.hasMarker(this.ETERNATUS_EXPANDED_BENCH, this)) {
                        player.marker.addMarker(this.ETERNATUS_EXPANDED_BENCH, this);
                    }
                    return 8;
                }
                else {
                    // removes the previous marker if this effect is removed
                    if (player.marker.hasMarker(this.ETERNATUS_EXPANDED_BENCH, this)) {
                        player.marker.removeMarker(this.ETERNATUS_EXPANDED_BENCH, this);
                    }
                    return 5;
                }
            });
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.player.marker.hasMarker(this.ETERNATUS_EXPANDED_BENCH, this)) {
            // trying to block non-dark types from being benched (this might still allow trainer to put in non-dark types)
            if (effect.pokemonCard.cardType !== D) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        // Dread End
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let darksInPlay = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                var _a;
                if (((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) === D) {
                    darksInPlay++;
                }
            });
            effect.damage = 30 * darksInPlay;
        }
        return state;
    }
}
exports.EternatusVMAX = EternatusVMAX;
