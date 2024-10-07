"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scatterbug = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Scatterbug extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 30;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Adaptive Evolution',
                text: 'This Pokémon can evolve during your first turn or the turn you play it.',
                powerType: game_1.PowerType.ABILITY
            }];
        this.attacks = [{
                name: 'Tackle',
                cost: [G, C],
                damage: 20,
                text: ''
            }];
        this.set = 'SVI';
        this.name = 'Scatterbug';
        this.fullName = 'Scatterbug SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.canEvolve = false;
        }
        // if (effect instanceof EvolveEffect && effect.target === this && state.turn === 2) {
        //   const player = effect.player;
        // }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect) {
            const player = effect.player;
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
exports.Scatterbug = Scatterbug;
