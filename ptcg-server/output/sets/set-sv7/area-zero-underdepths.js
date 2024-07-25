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
        this.set = 'SV6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.regulationMark = 'H';
        this.name = 'Area Zero Underdepths';
        this.fullName = 'Area Zero Underdepths SV6a';
        this.text = 'Players with a Tera Pokémon in play may have up to 8 Benched Pokémon.' +
            '' +
            '(If this card gets discarded, or if a player has no Tera Pokémon in play anymore, they discard Benched Pokémon until they have 5. If both players discard, this card\'s owner chooses first)';
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
