"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AncientBoosterEnergyCapsule = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class AncientBoosterEnergyCapsule extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Ancient Booster Energy Capsule';
        this.fullName = 'Ancient Booster Energy Capsule PAR';
        this.text = 'The Ancient Pokémon this card is attached to gets +60 HP, recovers from all Special Conditions, and can\'t be affected by any Special Conditions.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const card = effect.target.getPokemonCard();
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_a) {
                return state;
            }
            if (card === undefined) {
                return state;
            }
            if (card.tags.includes(card_types_1.CardTag.ANCIENT)) {
                effect.hp += 60;
            }
        }
        if (effect instanceof attack_effects_1.RemoveSpecialConditionsEffect && effect.target.cards.includes(this)) {
            const card = effect.target.getPokemonCard();
            const player = effect.player;
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_b) {
                return state;
            }
            if (card === undefined) {
                return state;
            }
            if (card.tags.includes(card_types_1.CardTag.ANCIENT)) {
                effect.target.specialConditions = [];
                effect.preventDefault = true;
                return state;
            }
        }
        return state;
    }
}
exports.AncientBoosterEnergyCapsule = AncientBoosterEnergyCapsule;
