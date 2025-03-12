"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GravityGemstone = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class GravityGemstone extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'H';
        this.setNumber = '137';
        this.set = 'SCR';
        this.name = 'Gravity Gemstone';
        this.fullName = 'Gravity Gemstone SCR';
        this.cardImage = 'assets/cardback.png';
        this.text = 'As long as the Pokémon this card is attached to is in the Active Spot, the Retreat Cost of both Active Pokémon is [C] more.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Try to reduce ToolEffect, to check if something is blocking the tool from working
            try {
                const stub = new play_card_effects_1.ToolEffect(effect.player, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (player.active.tools.includes(this) || opponent.active.tools.includes(this)) {
                effect.cost.push(card_types_1.CardType.COLORLESS);
            }
        }
        return state;
    }
}
exports.GravityGemstone = GravityGemstone;
