"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkyPillar = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class SkyPillar extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'D';
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '144';
        this.name = 'Sky Pillar';
        this.fullName = 'Sky Pillar CES';
        this.text = 'Prevent all effects of the opponent\'s attacks, including damage, done to Benched Pokémon (both yours and your opponent\'s).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            effect.preventDefault = true;
        }
        if (effect instanceof attack_effects_1.PutCountersEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.SkyPillar = SkyPillar;
