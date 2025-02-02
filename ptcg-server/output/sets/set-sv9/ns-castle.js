"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsCastle = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class NsCastle extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'SV9';
        this.name = 'N\'s Castle';
        this.fullName = 'N\'s Castle SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.text = 'Each N’s Pokémon in play (both yours and your opponent’s) has no Retreat Cost.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            if ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.NS)) {
                effect.cost = [];
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.NsCastle = NsCastle;
