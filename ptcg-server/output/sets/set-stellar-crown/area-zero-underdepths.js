"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaZeroUnderdepths = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class AreaZeroUnderdepths extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '131';
        this.regulationMark = 'H';
        this.name = 'Area Zero Underdepths';
        this.fullName = 'Area Zero Underdepths SV6a';
        this.text = 'Each player who has any Tera Pokémon in play can have up to 8 Pokémon on their Bench.' +
            '' +
            'If a player no longer has any Tera Pokémon in play, that player discards Pokémon from their Bench until they have 5. When this card leaves play, both players discard Pokémon from their Bench until they have 5, and the player who played this card discards first.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            effect.benchSizes = state.players.map((player, index) => {
                var _a, _b;
                let teraPokemon = 0;
                if ((_b = (_a = player.active) === null || _a === void 0 ? void 0 : _a.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.POKEMON_TERA)) {
                    teraPokemon++;
                }
                player.bench.forEach(benchSpot => {
                    var _a;
                    if ((_a = benchSpot.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_TERA)) {
                        teraPokemon++;
                    }
                });
                return teraPokemon >= 1 ? 8 : 5;
            });
            if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
            }
        }
        return state;
    }
}
exports.AreaZeroUnderdepths = AreaZeroUnderdepths;
