"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ditto = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Ditto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Dittobolic',
                powerType: game_1.PowerType.POKEBODY,
                text: 'The number of Benched Pokémon your opponent can have is now 4. If your opponent has 5 Benched Pokémon, your opponent must discard 1 of them and all cards attached to it.'
            }];
        this.attacks = [{
                name: 'Sharp Point',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Ditto';
        this.fullName = 'Ditto TM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            effect.benchSizes = state.players.map((player, index) => {
                // Return original bench size if pokebody is blocked
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.POKEBODY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return 5;
                }
                // Check for Ditto on opponent's board
                let isDittoInPlay = false;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    const pokemon = cardList.getPokemonCard();
                    if (!!pokemon && pokemon.name === 'Ditto' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
                        isDittoInPlay = true;
                    }
                });
                // Modify bench size
                if (isDittoInPlay) {
                    return 4;
                }
                // Return original bench size
                return 5;
            });
        }
        return state;
    }
}
exports.Ditto = Ditto;
