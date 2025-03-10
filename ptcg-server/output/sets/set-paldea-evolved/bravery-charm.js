"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BraveryCharm = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BraveryCharm extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '173';
        this.name = 'Bravery Charm';
        this.fullName = 'Bravery Charm PAL';
        this.text = 'The Basic Pokémon this card is attached to gets +50 HP.';
        this.HP_BONUS = 50;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
            const card = effect.target.getPokemonCard();
            // Try to reduce ToolEffect, to check if something is blocking the tool from working
            try {
                const stub = new play_card_effects_1.ToolEffect(effect.player, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (card === undefined) {
                return state;
            }
            if (card.stage === game_1.Stage.BASIC) {
                effect.hp += this.HP_BONUS;
                effect.target.hpBonus = (effect.target.hpBonus || 0) + this.HP_BONUS;
            }
        }
        return state;
    }
}
exports.BraveryCharm = BraveryCharm;
