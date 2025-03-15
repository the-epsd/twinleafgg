"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CynthiasPowerWeight = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class CynthiasPowerWeight extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.tags = [card_types_1.CardTag.CYNTHIAS];
        this.regulationMark = 'I';
        this.set = 'SV9a';
        this.setNumber = '60';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cynthia\'s Power Weight';
        this.fullName = 'Cynthia\'s Power Weight SV9a';
        this.text = 'The Cynthia\'s Pokémon this card is attached to gets +70 HP.';
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
            if (card.tags.includes(card_types_1.CardTag.CYNTHIAS)) {
                effect.hp += 70;
            }
        }
        return state;
    }
}
exports.CynthiasPowerWeight = CynthiasPowerWeight;
