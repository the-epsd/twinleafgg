"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eevee = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Eevee extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.COLORLESS;
        this.hp = 50;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Evolutionary Advantage',
                text: 'If you go second, this Pokémon can evolve during your first turn.',
                powerType: game_1.PowerType.ABILITY
            }];
        this.attacks = [{
                name: 'Reckless Charge',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 30,
                text: 'This Pokémon also does 10 damage to itself.'
            }];
        this.regulationMark = 'H';
        this.set = 'SVP';
        this.name = 'Eevee';
        this.fullName = 'Eevee SVP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '188';
        this.EVOLUTIONARY_ADVANTAGE_MARKER = 'EVOLUTIONARY_ADVANTAGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.EVOLUTIONARY_ADVANTAGE_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect) {
            const player = effect.player;
            player.marker.addMarker(this.EVOLUTIONARY_ADVANTAGE_MARKER, this);
        }
        const player = state.players[state.activePlayer];
        if (state.turn >= 1 && player.active.cards[0] == this && player.marker.hasMarker(this.EVOLUTIONARY_ADVANTAGE_MARKER, this)) {
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            player.canEvolve = true;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.pokemonPlayedTurn = state.turn - 1;
                }
            });
        }
        return state;
    }
}
exports.Eevee = Eevee;
