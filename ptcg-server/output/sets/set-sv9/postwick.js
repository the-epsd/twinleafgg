"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Postwick = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Postwick extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'SV9';
        this.name = 'Postwick';
        this.fullName = 'Postwick SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.text = 'The attacks of Hop\'s Pokémon (both yours and your opponent\'s) do 30 more damage to the opponent\'s Active Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof attack_effects_1.DealDamageEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // checking if this is targeting the active
            if (effect.target !== opponent.active) {
                return state;
            }
            // 'not a hopper' border checkpoint
            if (!((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.HOPS))) {
                return state;
            }
            effect.damage += 30;
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.Postwick = Postwick;
