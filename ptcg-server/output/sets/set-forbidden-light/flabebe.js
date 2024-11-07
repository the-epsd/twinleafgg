"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flabebe = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Flabebe extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 30;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Evolutionary Advantage',
                text: 'If you go second, this Pokémon can evolve during your first turn.',
                powerType: game_1.PowerType.ABILITY
            }];
        this.attacks = [{
                name: 'Tackle',
                cost: [Y],
                damage: 10,
                text: ''
            }];
        this.set = 'FLI';
        this.name = 'Flabébé';
        this.fullName = 'Flabebe FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect) {
            const player = effect.player;
            if (state.turn === 2) {
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
        return state;
    }
}
exports.Flabebe = Flabebe;
