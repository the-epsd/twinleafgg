"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AncientBoosterEnergyCapsule = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class AncientBoosterEnergyCapsule extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '159';
        this.name = 'Ancient Booster Energy Capsule';
        this.fullName = 'Ancient Booster Energy Capsule PAR';
        this.text = 'The Ancient Pokémon this card is attached to gets +60 HP, recovers from all Special Conditions, and can\'t be affected by any Special Conditions.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
            const card = effect.target.getPokemonCard();
            if (card === undefined) {
                return state;
            }
            // Try to reduce ToolEffect, to check if something is blocking the tool from working
            try {
                const stub = new play_card_effects_1.ToolEffect(effect.player, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (card.tags.includes(card_types_1.CardTag.ANCIENT)) {
                effect.hp += 60;
            }
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            // Try to reduce ToolEffect, to check if something is blocking the tool from working
            try {
                const stub = new play_card_effects_1.ToolEffect(effect.player, this);
                store.reduceEffect(state, stub);
            }
            catch (_b) {
                return state;
            }
            if (cardList instanceof game_1.PokemonCardList && cardList.tool === this) {
                const card = cardList.getPokemonCard();
                if (card && card.tags.includes(card_types_1.CardTag.ANCIENT)) {
                    const hasSpecialCondition = cardList.specialConditions.some(condition => condition !== card_types_1.SpecialCondition.ABILITY_USED);
                    if (hasSpecialCondition) {
                        cardList.specialConditions = cardList.specialConditions.filter(condition => condition === card_types_1.SpecialCondition.ABILITY_USED);
                    }
                }
            }
        }
        return state;
    }
}
exports.AncientBoosterEnergyCapsule = AncientBoosterEnergyCapsule;
